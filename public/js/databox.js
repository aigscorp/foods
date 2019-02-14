function DataBox(){
  let self = this instanceof DataBox ? this : Object.create(DataBox.prototype);
  for(let key in localStorage){
    if(localStorage.hasOwnProperty(key)){
      let val = JSON.parse(localStorage[key]);
      self[key] = val;
    }
  }
  return self;
};

DataBox.prototype.test = function(key, val){
  let value = this.storage[key];
  if(value == null) return false;
  return true;
};

DataBox.prototype.setData = function(key, value, field){
  if(this.isKey(key)){
    if(typeof(value) == "object" && Array.isArray(value) == false){
      let tmp = [];
      let state = this[key];

      if(Array.isArray(state)){
        let len = state.length;
        for(let j = 0; j < len; j++){
          if(state[j][field] == value[field]) return false;
        }
        for(let i = 0; i < len; i++){
          tmp.push(state[i]);
        }
        tmp.push(value);
      }else{
        if(state[field] == value[field]) return false;
        tmp.push(this[key], value);
      }

      // console.log("tmp = ", tmp);
      this[key] = tmp;
      localStorage[key] = JSON.stringify(tmp);
    }

  }else{
    this[key] = value;
    localStorage[key] = JSON.stringify(value);
  }
  return true;
};
DataBox.prototype.getData = function(key, prop){
  let tmp = this[key];
  let res;
  let keys = Object.keys(prop);
  if(Array.isArray(tmp)){
    let len = tmp.length;
    for(let i = 0; i < len; i++){
      if(tmp[i][keys[0]] == prop[keys[0]]){
        res = tmp[i][keys[1]];
        break;
      }
    }
  }else{
    res = tmp[keys[1]];
  }
  return res;
};

DataBox.prototype.isKey = function(key){
  if(this[key] == undefined || this[key] == null) return false;
  return true;
};
DataBox.prototype.changeData = function(key, prop){
  let tmp = this[key];
  let keys = Object.keys(prop);
  let vals = Object.values(prop);
  // console.log("keys = ", keys, "vals = ", vals);
  if(Array.isArray(tmp)){
    let len = tmp.length;
    for(let i = 0; i < len; i++){
      console.log(tmp[i][keys[0]], prop[keys[0]]);
      if(tmp[i][keys[0]] == prop[keys[0]]){
        // console.log("props = tmp");
        tmp[i][keys[1]] = vals[1];
        break;
      }
    }
  }else{
    if(tmp[keys[0]] == prop[keys[0]]){
      tmp[keys[1]] = vals[1];
    }
  }
  this[key] = tmp;
  localStorage[key] = JSON.stringify(tmp);
};



