import { NextPage } from "next";
import Head from 'next/head'
import ClassicPage, { commonStyles } from "../../components/ClassicPage/ClassicPage";
import styles from "../../styles/Leaderboard.module.scss";
import pageStyles from "../../styles/ChallengeLeaderboard.module.scss";
import useLanguage, { plural } from "../../hooks/useLanguage";
import WithAppContext from "../../components/WithAppContext/WithAppContext";
import Leaderboard from "../../components/Leaderboard/Leaderboard";
import useAuthUser from "../../hooks/useAuthUser";
import Link from "next/link";
import { FormEvent, MouseEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { usePaging } from "../../hooks/usePaging";
import usePlayerAutoComplete from "../../hooks/usePlayerAutoComplete";
import useChallengeDifficulties from "../../hooks/useChallengeDifficulties";
import Ad from "../../components/Ad/Ad";
import cx from "classnames";

const ChallengesLeaderboard: NextPage = () => {
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

  function handlePageChange(page) {
    setUsername("");
    setCurrentPage(page);
  }
  function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCurrentPage(1);
    setUsername(e.currentTarget.elements["username"].value);
  }

  const challengeDifficulties = useChallengeDifficulties();

  usePlayerAutoComplete({
    inputSelector: "#username",
    onSelect: (event, term) => {
      event.preventSubmit();
      setCurrentPage(1);
      setUsername(term);
    }
  });

  const [isRankingInfo, setIsRankingInfo] = useState(false);
  function toggleRankingInfo(e: MouseEvent) {
    e.preventDefault();
    setIsRankingInfo(!isRankingInfo);
  }

  return (
    <ClassicPage title={`${language ? 'Challenges leaderboard':'Classement défis'} - Mario Kart PC`} className={cx(styles.Leaderboard, pageStyles.ChallengeLeaderboard)} page="game">
      <Head>
        <link rel="stylesheet" href="/styles/auto-complete.css" />
      </Head>
      <h1>{ language ? 'Challenge points - Leaderboard':'Classement des points défis' }</h1>
      { language ? <div id={pageStyles.ranking_explain}>
				This page displays the ranking of the players with the most points in the MKPC challenge mode
				<a href="#null" onClick={toggleRankingInfo}>[Read more]</a>.
				<div id={pageStyles.ranking_info}>
					<Link href="/challenges">Challenges</Link> are actions to perform in the game (Ex: &quot;Complete a track in less than 1:30&quot;).
					They are created by members thanks to the <strong>challenge editor</strong>. Anyone can create challenges, including you!<br />
					When you complete a challenge, you win a certain amount of <strong>challenge points</strong> depending on the difficulty of the challenge. Your position in the ranking is determined by your number of challenge points.
					<ul>
            {challengeDifficulties.map(difficulty => <li>
              A challenge <strong>{difficulty.name}</strong> gives you <strong>{ plural("%n pt%s", difficulty.pts) }</strong>.
            </li>)}
					</ul>
				</div>
			</div> : <div id={pageStyles.ranking_explain}>
          Cette page affiche le classement des joueurs ayant le plus de points dans le mode défis de MKPC
          {" "}<a href="#null" onClick={toggleRankingInfo}>[En savoir plus]</a>.
          {isRankingInfo && <div id={pageStyles.ranking_info}>
            Les <Link href="/challenges">défis</Link> sont des actions à réaliser sur le jeu (Ex : &quot;Finir un circuit en moins de 1:30&quot;).
            Ils sont créés par les membres via l'<strong>éditeur de défis</strong>. N'importe qui peut créer des défis, vous aussi !<br />
            Lorsque vous réussissez un défi, vous gagnez un certain nombre de <strong>points défis</strong> en fonction de la difficulté. Ce sont ces points défis qui déterminent votre place dans le classement.
            <ul>
              {challengeDifficulties.map(difficulty => <li>
                Un défi <strong>{difficulty.name}</strong> rapporte <strong>{plural("%n pt%s", difficulty.pts)}</strong>
              </li>)}
            </ul>
          </div>}
        </div>}
      <p className={styles.pub}>
        <Ad bannerId="6691323567" width={468} height={60} />
      </p>
      <form method="post" action={"/leaderboard/challenge"} onSubmit={handleSearch}>
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
            mode: "challenge"
          },
          reloadDeps: [pageChanging, isBattle]
        }
      } username={username} pager={{
        paging,
        currentPage,
        onSetPage: handlePageChange,
      }} />
      
      <p><Link href={"/challenges"}>{ language ? 'Back to challenges list':'Retour à la liste des défis' }</Link><br />
      <Link href="/">{ language ? 'Back to Mario Kart PC':'Retour à Mario Kart PC' }</Link></p>
    </ClassicPage>
  );
}

export default WithAppContext(ChallengesLeaderboard);