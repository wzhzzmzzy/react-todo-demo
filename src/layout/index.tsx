import React, { Suspense } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import {Drawer, List, ListItem, ListItemButton, ListItemText} from "@mui/material";
import {useNavigate} from "react-router-dom";

export const LoadingPage : React.FC = ({ children }) => (
  <Suspense fallback={<div className="main"><CloudDownloadIcon /><p>Loading...</p></div>}>
    {children}
  </Suspense>
)

interface TodoProject {
  title: string
  path: string
}

const SideDrawer : React.FC<{ open: boolean, onToggle: (open: boolean) => void }> = ({ open, onToggle }) => {
  const navigate = useNavigate();
  const [todoProjects, setTodoProjects] = React.useState<TodoProject[]>([
    { title: 'Home', path: '/' },
    { title: '初级 TODO', path: '/todo/vanilla' },
    { title: '很慢的 TODO', path: '/todo/slow' },
    { title: '404 TODO', path: '/todo/noop' },
    { title: 'Redux TODO', path: '/todo/redux' }
  ]);
  const navigateTo = (path: string) => {
    onToggle(false);
    navigate(path);
  }

  return (
    <Drawer
      anchor={'left'}
      open={open}
      onClose={() => onToggle(false)}
    >
      <Box
        sx={{ width: 250 }}
        role="presentation"
      >
        <List>
          {todoProjects.map((todo, index) => (
            <ListItem key={todo.title} disablePadding>
              <ListItemButton onClick={() => navigateTo(todo.path)}>
                <ListItemText primary={todo.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  )
}

const Layout : React.FC = ({ children }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <section className="react-todo-example">
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => setOpen(!open)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              哒滴清单
            </Typography>
          </Toolbar>
        </AppBar>
        <SideDrawer open={open} onToggle={setOpen} />
        {children}
      </section>
    </Box>
  );
}

export default Layout;
