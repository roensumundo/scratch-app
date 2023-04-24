
var APP = {
  my_user: null,
  IAmTrainer: false,
  recommendations: {},
  offers: {}
}

class Class {
  constructor(title, description, dateTime, duration, creator) {
    this.title = title;
    this.description = description;
    this.datetime = dateTime;
    this.duration = duration;
    this.creator = creator;
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
  constructor(name, username) {
    this.name = name;
    this.username = username;
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
  constructor(name, username) {
    super(name, username);
    this.publishedClasses = {};
  }

  createClass(title, description, dateTime, duration) {
    const newClass = new Class(title, description, dateTime, duration, this);
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
