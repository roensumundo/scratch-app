
const PAGES = {
  LOGIN: 'login',
  MAIN: 'main',
  EXPLORE: 'explore',
  PERSONAL_SPACE: 'personal_space',
  CLASS_DETAIL: 'class_detail',
  PROFILE: 'profile'
};

var APP = {
  current_page: PAGES.LOGIN,
  my_user: null,
  IAmTrainer: false,
  recommendations: {},
  offers: {},
  setUser: (username,fullname, age, location, gender) => {
    if (APP.IAmTrainer) {
      APP.my_user = new Trainer(fullname, username, age, location, gender);
    } else {
      APP.my_user = new User(fullname, username, age, location, gender);
    }
  }
}



class Class {
  constructor(title, description, dateTime, duration, creator, level, price) {
    this.id = null;
    this.title = title;
    this.description = description;
    this.datetime = dateTime;
    this.duration = duration;
    this.creator = creator;
    this.level = level;
    this.price = price;
    this.enrolledUsers = [];
  }

  enrollUser(user_id) {
    this.enrolledUsers.push(user_id);
  }

  toJSON() {
    const { enrolledUsers, ...classData } = this;
    return classData;
  }
}

class User {
  constructor(name, username, age, location, gender) {
    this.name = name;
    this.username = username;
    this.age = age;
    this.gender = gender;
    this.location = location;
    this.enrolledClasses = {};
  }

  enrollClass(class_id, classObj) {
    this.enrolledClasses[class_id] = classObj;
  }

  toJSON() {
    const { enrolledClasses, ...userData } = this;
    return userData;
  }
}

class Trainer extends User {
  constructor(name, username, age, location, gender) {
    super(name, username, age, location, gender);
    this.publishedClasses = {};
  }

  createClass(title, description, dateTime, duration, level, price) {
    const newClass = new Class(title, description, dateTime, duration, this.username, level, price);
    return newClass;
  }

  saveClass(class_id, class_object) {
    this.publishedClasses[class_id] = class_object;
  }

  toJSON() {
    const { publishedClasses, ...trainerData } = this;
    return trainerData;
  }
}


var count_id = 0;

function init() {
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space') {
          displayClassOffer();
        }
    });
  explore_switcher();
}

function runMain() {
  const enrolledClasses = APP.my_user.enrolledClasses;
  for (const class_id in enrolledClasses) {
    let class_object = enrolledClasses[class_id];
    //TODO include duration in displayClassOffer function
    displayClassOffer(class_id, class_object.title, class_object.creator, class_object.datetime, class_object.description, class_object.duration);
  }
}
