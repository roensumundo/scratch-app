
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
  constructor(title, description, dateTime, duration, creator, level, price, maxUsers) {
    this.id = null;
    this.title = title;
    this.description = description;
    this.datetime = dateTime;
    this.duration = duration;
    this.creator = creator;
    this.level = level;
    this.price = price;
    this.maxUsers = maxUsers;
    this.enrolledUsers = [];
  }

  enrollUser(user_id) {
    if (this.enrolledUsers.length == this.maxUsers) {
      return false;
    } else {
      this.enrolledUsers.push(user_id);
      return true;
    }
    
  }

  toJSON() {
    const { enrolledUsers, ...classData } = this;
    return classData;
  }

  static fromJSON(json) {
    const classData = JSON.parse(json);
    const {
      id,
      title,
      description,
      datetime,
      duration,
      creator,
      level,
      price,
      maxUsers,
      enrolledUsers
    } = classData;
    const newClass = new Class(title, description, datetime, duration, creator, level, price, maxUsers);
    newClass.id = id;
    newClass.enrolledUsers = enrolledUsers;
    return newClass;
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
  static fromJSON(json) {
    const user = new User();
    Object.assign(user, json);
    const enrolledClasses = {};
    for (const classId in json.enrolledClasses) {
      const classObj = Class.fromJSON(json.enrolledClasses[classId]);
      enrolledClasses[classId] = classObj;
    }
    user.enrolledClasses = enrolledClasses;
    return user;
  }
}

class Trainer extends User {
  constructor(name, username, age, location, gender) {
    super(name, username, age, location, gender);
    this.publishedClasses = {};
  }

  createClass(title, description, dateTime, duration, level, price, maxUsers) {
    const newClass = new Class(title, description, dateTime, duration, this.username, level, price, maxUsers);
    return newClass;
  }

  saveClass(class_id, class_object) {
    this.publishedClasses[class_id] = class_object;
  }

  toJSON() {
  return JSON.stringify({
    ...super.toJSON(),
    publishedClasses: this.publishedClasses
  });
}
  static fromJSON(jsonString) {
    const { publishedClasses, ...trainerData } = JSON.parse(jsonString);
    const trainer = new Trainer(trainerData.name, trainerData.username, trainerData.age, trainerData.location, trainerData.gender);
    trainer.publishedClasses = publishedClasses;
    return trainer;
  }
}

function runMain() {
  //Loads client information from browser's local storage 
  //loadClientInfo();
  const my_user = APP.my_user;

  addNameToMenu(my_user.name, my_user.username);
  // Remove the link to publish-offer from the menu. 
  if (!APP.IAmTrainer) {
    const button = document.querySelector('.publish-offer');
    button.remove();
  }

  
  //Displays enrolled classes information
  const enrolledClasses = APP.my_user.enrolledClasses;
  for (const class_id in enrolledClasses) {
    let class_object = enrolledClasses[class_id];
    //TODO include duration in displayClassOffer function
    displayClassOffer(class_id, class_object.title, class_object.creator, class_object.datetime, class_object.description, class_object.duration);
  }
}

// Retrieve the APP information from localStorage when the main page loads
function loadClientInfo() {
  const storedAPP = localStorage.getItem('APP');
  if (storedAPP) {
    const APPinfo = JSON.parse(storedAPP);
    APP.IAmTrainer = APPinfo.IAmTrainer;
    //const jsonUser = JSON.stringify(APPinfo.my_user)

    if(APP.IAmTrainer)
      APP.my_user = Trainer.fromJSON(APPinfo.my_user)
    else
      APP.my_user = User.fromJSON(APPinfo.my_user)
  }
  
}
