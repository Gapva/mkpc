import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { EntityManager, FindOneOptions, In, LessThan, Raw } from 'typeorm';
import { Record } from './record.entity';
import { Ranking } from './ranking.entity';
import { CircuitService } from '../track-builder/circuit.service';
import { SearchService, EQUALITY_SEARCH } from '../search/search.service';
import { Profile } from 'src/user/profile.entity';

@Controller('/time-trial')
export class TimeTrialController {
  constructor(
    private em: EntityManager,
    private circuitService: CircuitService,
    private searchService: SearchService,
  ) {}

  @Post('/records/find')
  async getRecords(@Body() params) {
    const recordsPayload = await this.searchService.find({
      entity: Record,
      params,
      rules: {
        allowedFilters: {
          id: EQUALITY_SEARCH,
          circuit: EQUALITY_SEARCH,
          player: EQUALITY_SEARCH,
          class: EQUALITY_SEARCH,
          type: EQUALITY_SEARCH,
        },
        allowedOrders: ['id', 'date'],
        maxResults: 30,
      },
      where: {
        best: 1,
      },
      relations: ['player'],
    });
    const data = await Promise.all(
      recordsPayload.data.map(async (record) => {
        const circuit = record.type
          ? await this.circuitService.getCircuit(record.type, record.circuit)
          : undefined;
        const [circuitRecords, circuitRanking] = await Promise.all([
          this.em.count(Record, {
            where: {
              type: record.type,
              circuit: record.circuit,
              class: record.class,
              best: 1,
            },
          }),
          this.em.count(Record, {
            where: {
              type: record.type,
              circuit: record.circuit,
              class: record.class,
              best: 1,
              time: LessThan(record.time),
            },
          }),
        ]);
        return {
          id: record.id,
          name: record.name,
          character: record.character,
          date: record.date,
          class: record.class,
          time: record.time,
          type: record.type,
          circuit: circuit && {
            id: circuit.id,
            name: circuit.name,
            url: this.circuitService.getUrl(circuit),
          },
          player: record.player && {
            id: record.player.id,
            name: record.player.name,
          },
          leaderboard: {
            rank: circuitRanking + 1,
            count: circuitRecords,
          },
        };
      }),
    );
    return {
      data,
    };
  }

  @Get('/leaderboard')
  async getLeaderboard(@Query() params) {
    const ccFilter = +params.cc || 150;
    const baseFilters: FindOneOptions<Ranking>['where'] = {
      class: ccFilter,
      player: {
        deleted: false,
      },
    };
    let inputFilters: FindOneOptions<Ranking>['where'] = {};
    if (params.name) {
      inputFilters.player = {
        name: params.name,
      };
    }
    const where: FindOneOptions<Ranking>['where'] = {
      ...baseFilters,
      ...inputFilters,
    };
    let take = 20;
    let paging = params.paging || {};
    if (paging.limit < take) take = paging.limit;
    const skip = paging.offset;
    const isInputFilter = Object.keys(inputFilters).length > 0;
    const leaderboard: Ranking[] = await this.em.find(Ranking, {
      where,
      order: {
        score: 'DESC',
        player: 'ASC',
      },
      relations: ['player'],
      take,
      skip,
    });
    const count = paging.count
      ? await this.em.count(Ranking, {
          where: baseFilters,
          relations: ['player'],
        })
      : leaderboard.length;
    const profiles = await this.em.find(Profile, {
      where: {
        id: In(leaderboard.map((ranking) => ranking.player.id)),
      },
      relations: ['country'],
    });

    let firstRanking = 1 + (+skip || 0);
    if (isInputFilter && leaderboard.length > 0) {
      const userScore = leaderboard[0].score;
      firstRanking =
        1 +
        (await this.em.count(Ranking, {
          where: {
            ...baseFilters,
            score: Raw(
              `score AND (score > ${userScore} OR (score = ${userScore} AND player < ${leaderboard[0].player.id}))`,
            ),
          },
          relations: ['player'],
        }));
    }
    const data = leaderboard.map((ranking, i) => {
      const country = profiles.find(
        (profile) => profile.id === ranking.player.id,
      )?.country;
      return {
        id: ranking.player.id,
        name: ranking.player.name,
        score: ranking.score,
        rank: i + firstRanking,
        country: country && {
          id: country.id,
          code: country.code,
        },
      };
    });
    return { data, count };
  }
}
