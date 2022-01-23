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
import useScript from "../../hooks/useScript";
import { useRouter } from "next/router";
import { usePaging } from "../../hooks/usePaging";
import usePlayerAutoComplete from "../../hooks/usePlayerAutoComplete";
import Ad from "../../components/Ad/Ad";

const OnlineLeaderboard: NextPage = () => {
  const language = useLanguage();
  const router = useRouter();
  const authUser = useAuthUser();
  const { battle } = router.query;
  const isBattle = battle != null;

  const [username, setUsername] = useState("");
  const { paging, currentPage, setCurrentPage } = usePaging(20);
  const [pageChanging, setPageChanging] = useState(false);

  useEffect(() => {
    setPageChanging(false);
  }, [isBattle])

  function resetPage() {
    setPageChanging(true);
    handlePageChange(1);
  }
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
  });

  return (
    <ClassicPage title={`${language ? 'Online mode leaderboard':'Classement mode en ligne'} - Mario Kart PC`} className={styles.Leaderboard} page="game">
      <Head>
        <link rel="stylesheet" href="/styles/auto-complete.css" />
      </Head>
      <h1>{ language ? 'Leaderboard Mario Kart PC':'Classement Mario Kart PC' }</h1>
      <div className={styles["ranking-modes"]}>
        {
          isBattle ? <>
            <Link href="/leaderboard/online"><a onClick={resetPage}>{ language ? 'VS mode':'Course VS' }</a></Link>
            <span>{ language ? 'Battle mode':'Bataille de ballons' }</span>
          </> : <>
            <span>{ language ? 'VS mode':'Course VS' }</span>
            <Link href="/leaderboard/online?battle"><a onClick={resetPage}>{ language ? 'Battle mode':'Bataille de ballons' }</a></Link>
          </>
        }
      </div>
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
          endpoint: "/api/online-game/leaderboard",
          query: {
            mode: isBattle ? "battle" : "vs"
          },
          reloadDeps: [pageChanging, isBattle]
        }
      } username={username} pager={{
        paging,
        currentPage,
        onSetPage: handlePageChange,
      }} />
      
      <p><a href={`/online.php${isBattle ? '?battle':''}`}>{ language ? 'Back to the online mode home':'Retour à l\'accueil du mode en ligne' }</a><br />
      <Link href="/">{ language ? 'Back to Mario Kart PC':'Retour à Mario Kart PC' }</Link></p>
    </ClassicPage>
  );
}

export default WithAppContext(OnlineLeaderboard);