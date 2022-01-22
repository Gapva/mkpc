import styles from "./Leaderboard.module.scss"
import Skeleton from "../../components/Skeleton/Skeleton";
import useSmoothFetch, { Placeholder } from "../../hooks/useSmoothFetch";
import { buildQuery } from "../../helpers/uris";
import { formatRank } from "../../helpers/records";
import Pager, { useUrlPrefix } from "../../components/Pager/Pager";
import Link from "next/link";
import { usePaging } from "../../hooks/usePaging";
import useLanguage from "../../hooks/useLanguage";

type Props = {
  fetcherOptions: {
    endpoint: string;
    query: Record<string, string | number | (string | number)[]>;
    reloadDeps: any[];
    disabled: boolean;
  };
  username: string;
  pager: {
    paging,
    currentPage: number,
    onSetPage: (page: number) => void;
  }
}
function Leaderboard({fetcherOptions,username,pager}: Props) {
  const language = useLanguage();

  const { paging, currentPage, onSetPage } = pager;usePaging(20);

  const { data: leaderboardPayload, loading: leaderboardLoading } = useSmoothFetch(`${fetcherOptions.endpoint}?${buildQuery({
    name: username,
    "paging[limit]": paging.limit,
    "paging[offset]": paging.offset,
    "paging[count]": username ? undefined : 1,
    ...fetcherOptions.query
  })}`, {
    placeholder: () => ({
      data: Placeholder.array(paging.limit, (id) => ({
        id,
        name: Placeholder.word(10, 20),
        score: Placeholder.number(10000, 200000),
        rank: Placeholder.number(10, 99),
        country: null
      })),
      count: 0
    }),
    disabled: fetcherOptions.disabled,
    reloadDeps: [username, currentPage, ...fetcherOptions.reloadDeps]
  });

  const playerPage = username && leaderboardPayload.data[0] && Math.ceil(leaderboardPayload.data[0].rank / paging.limit);
  
  return <Skeleton loading={leaderboardLoading} className={styles.Leaderboard}>
    {leaderboardPayload.data.length ? <table>
      <thead>
        <tr id={styles.titres}>
        <td>Place</td>
        <td>{ language ? 'Nick':'Pseudo' }</td>
        <td>Score</td>
        </tr>
      </thead>
      <tbody>
        {leaderboardPayload.data.map((player,i) => <tr key={player.id} className={(i%2) ? styles.fonce:styles.clair}>
          <td>{formatRank(language, player.rank)}</td>
          <td>
            <a href={`/profil.php?id=${player.id}`} className={styles.recorder}>
              {player.country && <img src={`/images/flags/${player.country.code}.png`} alt={player.country.code} onError={(e) => e.currentTarget.style.display="none"} />}
              {player.name}
            </a>
          </td>
          <td>{player.score}</td>
        </tr>)}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={4} id={styles.page}>
            {username
              ? <>Page : <SinglePage page={playerPage} onSetPage={onSetPage} /></>
              : <Pager page={currentPage} paging={paging} count={leaderboardPayload.count} onSetPage={onSetPage} />
            }
          </td>
        </tr>
      </tfoot>
    </table>
    : <p>{language
        ? <strong>No results found for this search</strong>
        : <strong>Aucun résultat trouvé pour cette recherche</strong>
        }</p>
    }
  </Skeleton>
}

function SinglePage({page,onSetPage}) {
  const urlPrefix = useUrlPrefix();

  return <Link href={`${urlPrefix}page=${page}`}><a onClick={() => onSetPage(page)}>{page}</a></Link>
}

export default Leaderboard;