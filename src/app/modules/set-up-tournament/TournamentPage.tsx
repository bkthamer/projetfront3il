import {Route, Routes, Outlet} from 'react-router-dom'
//import SetUpTournament from './components/my-tournaments/SetUpTournament';
import SetUpTournament from './components/my-tournaments/SetUpTournament';
import DisplayDivisions from './components/tournaments-divisions/displayDivisions';
import DivisionConfig from './components/division-config/DivisionConfig';
import MatchConfig from './components/match-config/MatchConfig';


const TournamentPage=()=>(
    
    <Routes>
        <Route element={<Outlet />}>

                    <Route
                        path='mytournaments'
                        element={
                        <>                   
                        <SetUpTournament /> 
                        </> }
                        />

                    

                    <Route
                        path='displaydivisions/:Tournamentid'
                        element={
                            <>
                                <DisplayDivisions />
                            </>
                        }
                    />

                    <Route
                        path='divisionconfig/:id/:tournamentid'
                        element={
                            <>
                                <DivisionConfig />
                            </>
                        }
                    />

                    <Route
                        path='matchconfig/:id'
                        element={
                            <>
                                <MatchConfig />
                            </>
                        }
                    />
                    
        </Route>
    </Routes>

        )

export default TournamentPage;