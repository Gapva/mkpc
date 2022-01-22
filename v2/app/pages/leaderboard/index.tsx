import { NextPage } from "next";
import ClassicPage, { commonStyles } from "../../components/ClassicPage/ClassicPage";
import styles from "../../styles/Leaderboard.module.scss";
import useLanguage from "../../hooks/useLanguage";
import WithAppContext from "../../components/WithAppContext/WithAppContext";
import { useRouter } from "next/router";
import useAuthUser from "../../hooks/useAuthUser";
import useSmoothFetch, { Placeholder } from "../../hooks/useSmoothFetch";
import Link from "next/link";
import Skeleton from "../../components/Skeleton/Skeleton";
import { usePaging } from "../../hooks/usePaging";
import Pager from "../../components/Pager/Pager";
import { buildQuery } from "../../helpers/uris";
import { formatRank } from "../../helpers/records";
import useFormSubmit from "../../hooks/useFormSubmit";

const Leaderboard: NextPage = () => {
  const language = useLanguage();
  const router = useRouter();
  const handleSearch = useFormSubmit();
  const authUser = useAuthUser();

  const { username, battle } = router.query;
  const isBattle = battle != null;

  const { paging, currentPage, setCurrentPage } = usePaging(20);

  const resetPage = () => {
    setCurrentPage(1);
  };

  const { data: leaderboardPayload, loading: leaderboardLoading } = useSmoothFetch(`/api/online-game/leaderboard?${buildQuery({
    mode: isBattle ? "battle" : "vs",
    name: username,
    "paging[limit]": paging.limit,
    "paging[offset]": paging.offset,
    "paging[count]": 1
  })}`, {
    placeholder: () => ({
      data: Placeholder.array(20, (id) => ({
        id,
        name: Placeholder.word(10, 20),
        score: Placeholder.number(10000, 200000),
        rank: Placeholder.number(10, 99),
        country: null
      })),
      count: 0
    }),
    reloadDeps: [username, isBattle, currentPage]
  });

  return (
    <ClassicPage title={`${language ? 'Online mode leaderboard':'Classement mode en ligne'} - Mario Kart PC`} className={styles.Leaderboard} page="game">
      <h1>{ language ? 'Leaderboard Mario Kart PC':'Classement Mario Kart PC' }</h1>
      <div className={styles["ranking-modes"]}>
        {
          isBattle ? <>
            <Link href="/leaderboard"><a onClick={resetPage}>{ language ? 'VS mode':'Course VS' }</a></Link>
            <span>{ language ? 'Battle mode':'Bataille de ballons' }</span>
          </> : <>
            <span>{ language ? 'VS mode':'Course VS' }</span>
            <Link href="/leaderboard?battle"><a onClick={resetPage}>{ language ? 'Battle mode':'Bataille de ballons' }</a></Link>
          </>
        }
      </div>
      <form method="post" action={"/leaderboard"} onSubmit={handleSearch}>
        <blockquote>
          <p>
            <label htmlFor="username"><strong>{ language ? 'See player':'Voir joueur' }</strong></label>
            {" : "}
            <input type="text" name="username" id="username" defaultValue={username || authUser.name} />
            {isBattle && <input type="hidden" name="battle" value="" />}
            {" "}
            <input type="submit" value={ language ? 'Validate':'Valider' } className={commonStyles.action_button} /></p>
        </blockquote>
      </form>
      <Skeleton loading={leaderboardLoading}>
        <table>
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
                <a href={`profil.php?id=${player.id}`} className={styles.recorder}>
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
                <Pager page={currentPage} paging={paging} count={leaderboardPayload.count} onSetPage={setCurrentPage} />
              </td>
            </tr>
          </tfoot>
        </table>
      </Skeleton>
      <p><a href={`online.php${isBattle ? '?battle':''}`}>{ language ? 'Back to the online mode home':'Retour à l\'accueil du mode en ligne' }</a><br />
      <Link href="/">{ language ? 'Back to Mario Kart PC':'Retour à Mario Kart PC' }</Link></p>
    </ClassicPage>
  );
}

export default WithAppContext(Leaderboard);