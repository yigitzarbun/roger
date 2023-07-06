import PlayerCalendarHero from "../../../components/calendar/player/hero/PlayerCalendarHero";
import PlayerCalendarResults from "../../../components/calendar/player/results/PlayerCalendarResults";
import PlayerCalendarSearch from "../../../components/calendar/player/search/PlayerCalendarSearch";

const PlayerCalendar = () => {
  return (
    <div>
      <PlayerCalendarHero />
      <PlayerCalendarSearch />
      <PlayerCalendarResults />
    </div>
  );
};
export default PlayerCalendar;
