function mkSection(name, menu) {
  return {
    name: name,
    menu: menu,
  };
}

function mkMenu(name, icon, data, hidden) {
  let ret = {
    name: name,
    icon: icon,
    hidden: hidden,
  };

  if (Array.isArray(data)) {
    ret.subMenu = data;
  } else {
    ret.url = data;
  }

  return ret;
}

const MENU_TREE = [];

exports.getCurrentMenuInfo = (currentUrl) => {

  // 현재 선택된 메뉴 찾아서 Active 필드 채워넣기
  let menuTree = JSON.parse(JSON.stringify(MENU_TREE));
  let pageTitle = '';
  let breadcrumb = [];

  let section = menuTree.find((section) => {
    let menu = section.menu.find((menu) => {
      if (menu.url) {
        if (menu.url === currentUrl) {
          pageTitle = menu.name;
          return true;
        }
      } else {
        let subMenu = menu.subMenu.find((subMenu) => {
          return subMenu.url === currentUrl;
        });

        if (subMenu) {
          pageTitle = subMenu.name;
          breadcrumb.push(subMenu.name);

          subMenu.active = true;
          menu.current = subMenu;
          return true;
        }
      }
    });

    if (menu) {
      pageTitle = pageTitle || menu.name;
      breadcrumb.push(menu.name);

      menu.active = true;
      section.current = menu;
      return true;
    }
  });

  if (section) {
    breadcrumb.push(section.name);

    section.active = true;
    menuTree.current = section;
  }
  // end 현재 선택된 메뉴 찾아서 Active 필드 채워넣기

  return {menuTree, pageTitle, breadcrumb};
};

exports.setHiddenByUserType = (menuTree, userType) => {
  menuTree.map((section) => {
    if (section.allowUserType.indexOf(userType) < 0) {
      section.hidden = true;
    }

    section.menu.map((menu) => {
      if (menu.allowUserType.indexOf(userType) < 0) {
        menu.hidden = true;
      }

      if (menu.subMenu) {
        menu.subMenu.map((subMenu) => {
          if (subMenu.allowUserType.indexOf(userType) < 0) {
            subMenu.hidden = true;
          }
        });
      }
    });
  });

  return menuTree;
}