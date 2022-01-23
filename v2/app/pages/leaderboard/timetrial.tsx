import { NextPage } from "next";
import Head from 'next/head'
import ClassicPage, { commonStyles } from "../../components/ClassicPage/ClassicPage";
import styles from "../../styles/Leaderboard.module.scss";
import useLanguage from "../../hooks/useLanguage";
import WithAppContext from "../../components/WithAppContext/WithAppContext";
import Leaderboard from "../../components/Leaderboard/Leaderboard";
import useAuthUser from "../../hooks/useAuthUser";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { usePaging } from "../../hooks/usePaging";
import Ad from "../../components/Ad/Ad";
import usePlayerAutoComplete from "../../hooks/usePlayerAutoComplete";

const OnlineLeaderboard: NextPage = () => {
  const language = useLanguage();
  const router = useRouter();
  const authUser = useAuthUser();
  const { cc } = router.query;

  const [username, setUsername] = useState("");
  const { paging, currentPage, setCurrentPage } = usePaging(20);
  const [pageChanging, setPageChanging] = useState(false);

  useEffect(() => {
    setPageChanging(false);
  }, [cc])

  function handlePageChange(page) {
    setUsername("");
    setCurrentPage(page);
  }
  function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCurrentPage(1);
    setUsername(e.currentTarget.elements["username"].value);
  }

  usePlayerAutoComplete({
    inputSelector: "#username",
    onSelect: (event, term) => {
      event.preventSubmit();
      setCurrentPage(1);
      setUsername(term);
    }
  })

  return (
    <ClassicPage title={`${language ? 'Time trial ranking':'Classement contre-la-montre'} - Mario Kart PC`} className={styles.Leaderboard} page="game">
      <Head>
        <link rel="stylesheet" href="/styles/auto-complete.css" />
      </Head>
      <h1>{ language ? 'Time Trial - Global ranking':'Contre-la-montre - Classement global' }</h1>
      <div className={styles["ranking-modes"]}>
        {
          (cc === "200") ? <>
            <Link href="?cc=150">150cc</Link>
            <span>200cc</span>
          </> : <>
			      <span>150cc</span>
            <Link href="?cc=200">200cc</Link>
          </>
        }
      </div>
      { language ? <p>
        This page shows a leaderboard of top players in time trial.<br />
        This leaderboard is based on a score calculation which depends on your rank on each circuit. See <a href="/topic.php?topic=5318">this topic</a> for further info.
        </p> : <p>
          Cette page affiche le classement des meilleurs joueurs en contre la montre.<br />
          Ce classement se base sur un calcul de score dépendant de votre place sur chaque circuit. Voir <a href="/topic.php?topic=5318">ce topic</a> pour en savoir plus.
        </p>}
        <div className={styles.pub}>
          <Ad bannerId="6691323567" width={468} height={60} />
        </div>
        <form method="post" action={"/leaderboard/online"} onSubmit={handleSearch}>
        <blockquote>
          <p>
            <label htmlFor="username"><strong>{ language ? 'See player':'Voir joueur' }</strong></label>
            {" : "}
            <input type="text" name="username" id="username" defaultValue={username || authUser.name} />
            {" "}
            <input type="submit" value={ language ? 'Validate':'Valider' } className={commonStyles.action_button} /></p>
        </blockquote>
      </form>

      <Leaderboard fetcherOptions={
        {
          disabled: pageChanging,
          endpoint: "/api/time-trial/leaderboard",
          query: {
            cc
          },
          reloadDeps: [pageChanging, cc]
        }
      } username={username} pager={{
        paging,
        currentPage,
        onSetPage: handlePageChange,
      }} />
      
  	<p>
        <a href={`/classement.php?cc=${cc}`}>{ language ? 'Ranking circuit by circuit':'Classement circuit par circuit' }</a><br />
        <Link href="/">{ language ? 'Back to Mario Kart PC':'Retour à Mario Kart PC' }</Link>
    </p>
    </ClassicPage>
  );
}

export default WithAppContext(OnlineLeaderboard);