import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../../modules/auth';
import { TablesWidget1 } from '../../../../../_metronic/partials/widgets/tables/TablesWidget1';

const DisplayDivisions = () => {
  const [divisions, setDivisions] = useState([]);
  const { Tournamentid } = useParams();
  const { auth } = useAuth();

  useEffect(() => {
    const fetchDivisions = async () => {
        try {
          // change it with axios not fetch 
          const response = await fetch(`${process.env.REACT_APP_API_URL}/division/divisions/${Tournamentid}`, {
            headers: {
              Authorization: `Bearer ${auth?.api_token}`
            }
          });
          const data = await response.json();
          setDivisions(data.divisions);
        } catch (error) {
          console.error('Error fetching divisions:', error);
        }
      };

    fetchDivisions();
  }, [Tournamentid, auth?.api_token]);



console.log('divisions', divisions);
return (
    <>
        
        < TablesWidget1 Divisions={divisions}/>
    </>
);
};

export default DisplayDivisions;