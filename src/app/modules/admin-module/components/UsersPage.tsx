import {useState , useEffect}from 'react'
import axios from 'axios';

import { TablesWidget11Admin } from '../../../../_metronic/partials/widgets/tables/TablesWidget11Admin';
import { useAuth } from '../../auth';
import { TablesWidget11AdminUsers } from '../../../../_metronic/partials/widgets/tables/TablesWidget11AdminUsers';


function UsersPage(){

    const [Users, setUsers] = useState([]);
    const { auth } = useAuth();



    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/users`, {
          headers: {
            Authorization: `Bearer ${auth?.api_token}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching tournaments:', error);
      }
    };
  
    useEffect(() => {
      fetchUsers();
    }, []);
  





   return(
        <div>
            <TablesWidget11AdminUsers Users={Users} />
         

        </div>
    )

}


export default UsersPage;