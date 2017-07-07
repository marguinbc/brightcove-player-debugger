import { IDs } from './componentIDs.js';
/* classesListPane */
const dom = videojs.dom || videojs;
<<<<<<< HEAD

let allClassesList,
  allClasses = [
    'ima3-loading-spinner',
    'not-hover',
    'vjs-ad-controls',
    'vjs-ad-loading',
    'vjs-ad-playing',
    'vjs-audio',
    'vjs-controls-disabled',
    'vjs-controls-enabled',
    'vjs-ended',
    'vjs-errors',
    'vjs-fluid',
    'vjs-fullscreen',
    'vjs-has-started',
    'vjs-ima3-flash',
    'vjs-ima3-html5',
    'vjs-live',
    'vjs-mouse',
    'vjs-no-flex',
    'vjs-paused',
    'vjs-playing',
    'vjs-plugins-ready',
    'vjs-scrubbing',
    'vjs-seeking',
    'vjs-touch-enabled',
    'vjs-user-active',
    'vjs-user-inactive',
    'vjs-using-native-controls',
    'vjs-waiting',
    'vjs-workinghover'
  ],
  thisPlayer;

export let togglePlayerClass = (playerClass) => {
  let playerClassList = thisPlayer.el_.classList;
  let listEl = document.getElementById(playerClass);
  playerClassList.toggle(playerClass);
  if (playerClassList.contains(playerClass)) {
    listEl.setAttribute('class', 'active');
  } else {
    listEl.removeAttribute('class');
  }
};

let allPlayerClasses = (player) => {
  let listItems, classItem, toggleLink;
  allClasses.forEach(function(entry, index) {
    if (player.el_.classList.contains(entry)) {
      classItem = dom.createEl('li',
        {
          'className': 'active',
          'id': entry,
          'title': entry + ' active'
        });
    } else {
      classItem = dom.createEl('li', {
        'id': entry,
        'title': entry
      });
    }
    toggleLink = dom.createEl('a', {'href': '#'});
    toggleLink.onclick = function() { togglePlayerClass(entry); };
    toggleLink.innerHTML = entry;
    classItem.appendChild(toggleLink);
    allClassesList.appendChild(classItem);
  });
};
=======

  let allClassesList,
      allClasses = [
        "ima3-loading-spinner",
        "not-hover",
        "vjs-ad-controls",
        "vjs-ad-loading",
        "vjs-ad-playing",
        "vjs-audio",
        "vjs-controls-disabled",
        "vjs-controls-enabled",
        "vjs-ended",
        "vjs-errors",
        "vjs-fluid",
        "vjs-fullscreen",
        "vjs-has-started",
        "vjs-ima3-flash",
        "vjs-ima3-html5",
        "vjs-live",
        "vjs-mouse",
        "vjs-no-flex",
        "vjs-paused",
        "vjs-playing",
        "vjs-plugins-ready",
        "vjs-scrubbing",
        "vjs-seeking",
        "vjs-touch-enabled",
        "vjs-user-active",
        "vjs-user-inactive",
        "vjs-using-native-controls",
        "vjs-waiting",
        "vjs-workinghover"
      ],
      thisPlayer;

  export let togglePlayerClass = (playerClass) => {
    let playerClassList = thisPlayer.el_.classList;
    let listEl = document.getElementById(playerClass);
    playerClassList.toggle(playerClass);
    if (playerClassList.contains(playerClass)) {
      listEl.setAttribute('class', 'active');
    } else {
      listEl.removeAttribute('class');
    }
  };

  let allPlayerClasses = (player) => {
    let listItems, classItem, toggleLink;
    allClasses.forEach(function(entry, index) {
      if (player.el_.classList.contains(entry)) {
        classItem = dom.createEl('li',
        {
          "className" : 'active',
          "id" : entry,
          "title" : entry + ' active'
        });
      } else {
        classItem = dom.createEl('li', {
          "id" : entry,
          "title" : entry
        });
      }
      toggleLink = dom.createEl('a', {"href" : "#"});
      toggleLink.onclick = function() {  togglePlayerClass(entry) };
      toggleLink.innerHTML = entry;
      classItem.appendChild(toggleLink);
      allClassesList.appendChild(classItem);
    });
  };
>>>>>>> upstream/master

export let refreshPlayerClasses = (player) => {

  let listItems, classItem, toggleLink;

  allClassesList = document.getElementById('all-classes-list');

  if (allClassesList.hasChildNodes()) {
    while (allClassesList.firstChild) {
      allClassesList.removeChild(allClassesList.firstChild);
    }
  }
  allPlayerClasses(player);
    // showPosterStyles();
    // showBigPlayButtonStyles();
};

export let buildClassesListPane = (player) => {

  let classesListPane, classesListHeader, classesListFooter, classItem, toggleLink;

<<<<<<< HEAD
  thisPlayer = player;
  classesListPane = dom.createEl('div',
      {'id': IDs.classesList}
    );

  classesListHeader = dom.createEl('div', {
    'className': 'classListHeader'
  });
  classesListHeader.innerHTML = '<h2>Player Classes</h2><span class="active">active</span><span class="inactive">inactive</span>';
  classesListPane.appendChild(classesListHeader);
=======
    let classesListPane, classesListHeader, classesListFooter, classItem, toggleLink;

    thisPlayer = player;
    classesListPane = dom.createEl("div",
      {'id': IDs.classesList}
    );

    classesListHeader = dom.createEl('div',{
      "className" : "classListHeader"
    });
    classesListHeader.innerHTML = '<h2>Player Classes</h2><span class="active">active</span><span class="inactive">inactive</span>';
    classesListPane.appendChild(classesListHeader);
>>>>>>> upstream/master

  allClassesList = document.createElement('ul');
  allClassesList.setAttribute('id', 'all-classes-list');

  allPlayerClasses(player);

<<<<<<< HEAD
  classesListPane.appendChild(allClassesList);

  classesListPane.appendChild(document.createElement('br'));

  classesListFooter = document.createElement('span');
  classesListFooter.innerHTML = 'Click on a class to toggle its state';
  classesListPane.appendChild(classesListFooter);

  return classesListPane;
};
=======
    classesListPane.appendChild( allClassesList);

    classesListPane.appendChild(document.createElement('br'));

    classesListFooter = document.createElement('span');
    classesListFooter.innerHTML = "Click on a class to toggle its state";
    classesListPane.appendChild(classesListFooter);

    return classesListPane;
  }
>>>>>>> upstream/master
