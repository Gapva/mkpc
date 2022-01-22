import { Controller, Get, Query } from '@nestjs/common';
import { Profile } from 'src/user/profile.entity';
import { EntityManager, FindOneOptions, In, LessThan, Equal, Not, Raw } from 'typeorm';
import { User } from '../user/user.entity';

@Controller("/online-game")
export class OnlineGameController {
  constructor(private em: EntityManager) { }

  @Get("/leaderboard")
  async getLeaderboard(@Query() params) {
    const baseFilters: FindOneOptions<User>["where"] = {
      deleted: false
    };
    let inputFilters: FindOneOptions<User>["where"] = {};
    let score = "pts_vs";
    if (params) {
      if (params.name)
        inputFilters.name = params.name;
      switch (params.mode) {
        case "battle":
          score = "pts_battle";
          break;
        case "challenge":
          score = "pts_challenge";
          break;
      }
    }
    if (score !== "pts_challenge") {
      baseFilters[score] = Not(5000);
    }
    let take = 20;
    let paging = params.paging || {};
    if (paging.limit < take) take = paging.limit;
    const skip = paging.offset;
    const isInputFilter = Object.keys(inputFilters).length > 0;
    const leaderboard = await this.em.find(User, {
      where: isInputFilter ? inputFilters : baseFilters,
      order: {
        [score]: "DESC",
        id: "ASC"
      },
      take,
      skip
    });
    const count = paging.count ? await this.em.count(User, {
      where: baseFilters,
    }) : leaderboard.length;
    const profiles = await this.em.find(Profile, {
      where: {
        id: In(leaderboard.map((user) => user.id))
      },
      relations: ["country"]
    });

    let firstRanking = 1+(+skip||0);
    if (isInputFilter && leaderboard.length > 0) {
      const userScore = leaderboard[0][score];
      firstRanking = 1 + await this.em.count(User, {
        where: {
          ...baseFilters,
          id: Raw(`id AND (${score} > ${userScore} OR (${score} = ${userScore} AND id < ${leaderboard[0].id}))`)
        }
      })
    }

    const data = leaderboard.map((user, i) => {
      const country = profiles.find((profile) => profile.id === user.id)?.country;
      return {
        id: user.id,
        name: user.name,
        score: user[score],
        rank: i + firstRanking,
        country: country && {
          id: country.id,
          code: country.code
        }
      }
    });
    return { data, count };
  }
}
