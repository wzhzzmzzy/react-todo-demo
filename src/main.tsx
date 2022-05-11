import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Layout, { LoadingPage } from './layout'
import Page404 from "./views/404";
import './styles/index.css'

const App = React.lazy(() => import('./App'));
const VanillaTodo = React.lazy(() => import('./views/vanilla-todo/vanilla'));
const ReduxTodo = React.lazy(() => import('./views/redux-todo/with-redux'));
const SlowTodo = React.lazy(async () => {
  await new Promise(resolve => setTimeout(resolve, 3000));
  return import('./views/vanilla-todo/vanilla')
});

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<LoadingPage><App /></LoadingPage>} />
          <Route path="/todo/vanilla" element={<LoadingPage><VanillaTodo /></LoadingPage>} />
          <Route path="/todo/slow" element={<LoadingPage><SlowTodo /></LoadingPage>} />
          <Route path="/todo/redux" element={<LoadingPage><ReduxTodo /></LoadingPage>} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)
