import React from "react";

import "@blueprintjs/core/lib/css/blueprint.css";
import { Menu, Classes, MenuItem, MenuDivider, Icon, Navbar, NavbarGroup, NavbarHeading, NavbarDivider } from "@blueprintjs/core";

function App() {
  return (
    <div>
      <Navbar>
        <NavbarGroup>
          <NavbarHeading>Retirement Planner</NavbarHeading>
          <NavbarDivider />
          <MenuItem icon="home" text="Home" />
          <MenuItem icon="new-link" text="WebLinks" />
          <MenuItem icon="user" text="Profile" />
          <MenuItem icon="cog" text="Setting" />
        </NavbarGroup>
      </Navbar>

      <h4>ReactJS Blueprint Menu Component</h4>
      <Menu className={Classes.ELEVATION_1}>
        <MenuItem icon={<Icon icon="home" />} text="Home" />
        <MenuDivider />
        <MenuItem icon="new-link" text="WebLinks" />
        <MenuItem icon="user" text="Profile" />
        <MenuDivider />
        <MenuItem icon="cog" text="Setting" />
      </Menu>

    </div>
  );
}

export default App;