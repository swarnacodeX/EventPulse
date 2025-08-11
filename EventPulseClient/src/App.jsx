
import Explore from './pages/Global/Explore.jsx'
import {Routes,Route} from 'react-router-dom'

function App() {

  return (
    <div>
      <Routes> 
        <Route path='/explore' element={<Explore/> } />
        </Routes>
    </div>
  )
}
export default App;
