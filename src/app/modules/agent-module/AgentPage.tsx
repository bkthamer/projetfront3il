import { Outlet, Route, Routes } from "react-router-dom";
import MatchAgentPage from "./components/MatchAgentPage";
import MatchAffected from "./components/MatchAffected";





const AgentPage = () => (


    <Routes>
    <Route element={<Outlet />}>

                <Route
                    path='Match'
                    element={
                    <>                   
                    <MatchAgentPage /> 
                    </> }
                    />

                
    </Route>
    <Route
                    path='MatchAgent'
                    element={
                    <>                   
                    <MatchAffected/> 
                    </> }
                    />

</Routes>

)

export default AgentPage;