import { Controller, Get, Query } from '@nestjs/common';
import { Profile } from 'src/user/profile.entity';
import { EntityManager, FindOneOptions, In } from 'typeorm';
import { User } from '../user/user.entity';

@Controller("/online-game")
export class OnlineGameController {
  constructor(private em: EntityManager) { }

  @Get("/leaderboard")
  async getLeaderboard(@Query() params) {
    const where: FindOneOptions<User>["where"] = {
      deleted: false
    };
    let score = "pts_vs";
    if (params) {
      if (params.name)
        where.name = params.name;
      switch (params.mode) {
        case "battle":
          score = "pts_battle";
          break;
        case "challenge":
          score = "pts_challenge";
          break;
      }
    }
    let take = 20;
    let paging = params.paging || {};
    if (paging.limit < take) take = paging.limit;
    const skip = paging.offset;
    const leaderboard = await this.em.find(User, {
      where,
      order: {
        [score]: "DESC"
      },
      take,
      skip
    });
    const count = paging.count ? await this.em.count(User, {
      where,
    }) : leaderboard.length;
    const profiles = await this.em.find(Profile, {
      where: {
        id: In(leaderboard.map((user) => user.id))
      },
      relations: ["country"]
    });
    const firstRanking = 1+(+skip||0);
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
