from flask import Flask, request
from flask_pymongo import PyMongo
from flask_cors import CORS, cross_origin

app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb://exceed_group05:ram5txtf@158.108.182.0:2255/exceed_group05'
cors = CORS(app)
mongo = PyMongo(app)
myCollection = mongo.db.room

# line notify------------------
import requests
url = 'https://notify-api.line.me/api/notify'
token = 'BeFkJellNSDwMKc0pkwICciX5m8OrNeA81XGLpgMBGj'
headers = {'content-type':'application/x-www-form-urlencoded','Authorization':'Bearer '+token}

def warningNotify(message):
    r = requests.post(url, headers=headers, data = {'message':message})
    print ("send notify success : ", r.text)
#  ----------------------------
def check_quality(lpg_ratio, co_ratio, ch4_ratio, h2_ratio, room_name):
    tmp = [lpg_ratio, co_ratio, ch4_ratio, h2_ratio]
    # print("debug - check_quality[tmp]: ", tmp)
    tmp.sort()
    print("test log tmp", tmp);
    warning_value = tmp[-1] * 100
    warning_string = ""
    # print("debug - check_quality[warning_value]: ", warning_value)
    if(warning_value >= 100):
        warningNotify("Emergency at " + room_name )
        warning_string = "danger"
    elif(warning_value >= 66.66):
        warning_string = "unhealthy"
    elif(warning_value >= 33.33):
        warning_string = "moderate"
    else:
        warning_string = "good"
    
    return warning_string

"""find all room"""
@app.route('/find_all', methods=['GET'])
@cross_origin()
def find_all():
    output = []
    flit = {}
    query = myCollection.find(flit)
    for ele in query:
        output.append({
            "room": ele["room"],
            "room_owner": ele["room_owner"],
            "temperature": ele["temperature"],
            "humidity": ele["humidity"],
            "lpg_warning": ele["lpg_warning"],
            "lpg_history": ele["lpg_history"],
            "co_warning": ele["co_warning"],
            "co_history": ele["co_history"],
            "ch4_warning": ele["ch4_warning"],
            "ch4_history": ele["ch4_history"],
            "h2_warning": ele["h2_warning"],
            "h2_history": ele["h2_history"],
        })
    return { "result": output }

"""find only room that you search"""
@app.route('/find', methods=['GET'])
@cross_origin()
def find():
    room_name = request.args.get('room')
    flit = {"room": room_name}
    output = []
    query = myCollection.find(flit)
    for ele in query:
        output.append({
            "room": ele["room"],
            "room_owner": ele["room_owner"],
            "temperature": ele["temperature"],
            "humidity": ele["humidity"],
            "lpg_warning": ele["lpg_warning"],
            "lpg_history": ele["lpg_history"],
            "co_warning": ele["co_warning"],
            "co_history": ele["co_history"],
            "ch4_warning": ele["ch4_warning"],
            "ch4_history": ele["ch4_history"],
            "h2_warning": ele["h2_warning"],
            "h2_history": ele["h2_history"],
        })
    return {"result": output}

@app.route('/current_room', methods=['GET'])
@cross_origin()
def current_room():
    room_name = request.args.get('room')
    flit = {"room": room_name}
    query = myCollection.find(flit)
    this_room = query[0]
    output = []
    output.append({"room": this_room["room"],
            "room_owner": this_room["room_owner"]})
    return {"current_room": output}

@app.route('/find_array', methods=['GET'])
@cross_origin()
def find_array():
    room_name = request.args.get('room')
    flit = {"room": room_name}
    output = []
    query = myCollection.find(flit)
    for ele in query:
        output.append({
            "lpg_history": ele["lpg_history"],
            "co_history": ele["co_history"],
            "ch4_history": ele["ch4_history"],
            "h2_history": ele["h2_history"],
        })
    return {"result": output}

@app.route('/find_lpg', methods=['GET'])
@cross_origin()
def find_lpg():
    room_name = request.args.get('room')
    flit = {"room": room_name}
    query = myCollection.find(flit)
    this_room = query[0]
    return {"lpg_history": this_room["lpg_history"]}

@app.route('/find_lpg_now', methods=['GET'])
@cross_origin()
def find_lpg_now():
    room_name = request.args.get('room')
    flit = {"room": room_name}
    query = myCollection.find(flit)
    this_room = query[0]
    this_lpg = this_room["lpg_history"][-1]
    return {"lpg_now": this_lpg}

@app.route('/find_co', methods=['GET'])
@cross_origin()
def find_co():
    room_name = request.args.get('room')
    flit = {"room": room_name}
    query = myCollection.find(flit)
    this_room = query[0]
    return {"co_history": this_room["co_history"]}

@app.route('/find_co_now', methods=['GET'])
@cross_origin()
def find_co_now():
    room_name = request.args.get('room')
    flit = {"room": room_name}
    query = myCollection.find(flit)
    this_room = query[0]
    this_co = this_room["co_history"][-1]
    return {"co_now": this_co}

@app.route('/find_ch4', methods=['GET'])
@cross_origin()
def find_ch4():
    room_name = request.args.get('room')
    flit = {"room": room_name}
    query = myCollection.find(flit)
    this_room = query[0]
    return {"ch4_history": this_room["ch4_history"]}

@app.route('/find_ch4_now', methods=['GET'])
@cross_origin()
def find_ch4_now():
    room_name = request.args.get('room')
    flit = {"room": room_name}
    query = myCollection.find(flit)
    this_room = query[0]
    this_ch4 = this_room["ch4_history"][-1]
    return {"ch4_now": this_ch4}

@app.route('/find_h2', methods=['GET'])
@cross_origin()
def find_h2():
    room_name = request.args.get('room')
    flit = {"room": room_name}
    query = myCollection.find(flit)
    this_room = query[0]
    return {"h2_history": this_room["h2_history"]}

@app.route('/find_h2_now', methods=['GET'])
@cross_origin()
def find_h2_now():
    room_name = request.args.get('room')
    flit = {"room": room_name}
    query = myCollection.find(flit)
    this_room = query[0]
    this_h2 = this_room["h2_history"][-1]
    return {"h2_now": this_h2}


@app.route('/find_quality', methods=['GET'])
@cross_origin()
def find_quality():
    room_name = request.args.get('room')
    flit = {"room": room_name}
    query = myCollection.find(flit)
    this_room = query[0]
    return {"quality": this_room["quality"], "qualityBL" : this_room["quality"] == "danger"}

@app.route('/find_temperature', methods=['GET'])
@cross_origin()
def find_temperature():
    room_name = request.args.get('room')
    flit = {"room": room_name}
    query = myCollection.find(flit)
    this_room = query[0]
    return {"temperature": this_room["temperature"]}

"""update data of room """
@app.route('/update', methods=['POST'])
def update():
    data = request.json
    room_name = request.args.get('room')
    flit = {"room": room_name}
    query = myCollection.find(flit)
    this_room = query[0]
    this_room["lpg_history"].append(data["lpg"])
    this_room["co_history"].append(data["co"])
    this_room["ch4_history"].append(data["ch4"])
    this_room["h2_history"].append(data["h2"])

    tmpQaulityStatus = this_room["quality"]
    # for trigger line notify
    quality = check_quality(
        data["lpg"] / this_room["lpg_warning"],
        data["co"] / this_room["co_warning"],
        data["ch4"] / this_room["ch4_warning"],
        data["h2"] / this_room["h2_warning"],
        room_name
    )
    if tmpQaulityStatus == 'danger' and quality != "danger":
        this_room["switch"] = False
    # print("debug - update[quality]: ", quality)

    updated_content = {"$set": {
	    'quality':  quality,
        'temperature': data["temperature"],
        'humidity': data["humidity"],
        'lpg_history':this_room["lpg_history"],
        'co_history': this_room["co_history"],
        'ch4_history': this_room["ch4_history"],
        'h2_history': this_room["h2_history"],
        'switch': this_room["switch"] or quality == 'danger'
    }}
    myCollection.update_one(flit, updated_content)
    return {"result": "update complete"}

@app.route('/set_warning', methods=['PUT'])
def update_warning():
    data = request.json
    room_name = request.args.get('room')
    flit = {"room": room_name}
    updated_content = {"$set": {
        "room_owner" : data["room_owner"],
        "lpg_warning" : data["lpg_warning"],
        "co_warning" : data["co_warning"],
        "ch4_warning" : data["ch4_warning"],
        "h2_warning" : data["h2_warning"],
    }}
    # print("debug - update_warning[updated_content]: ", updated_content)
    myCollection.update_one(flit, updated_content)
    return {"result": "set warning completed"}


@app.route('/set_switch', methods=['PUT'])
def set_switch():
    data = request.json
    room_name = request.args.get('room')
    flit = {"room": room_name}
    updated_content = {"$set": {
        "switch" : data["switch"],
    }}
    # print("debug - set_switch[updated_content]: ", updated_content)
    myCollection.update_one(flit, updated_content)
    return {"result": "set switch complete"}

@app.route('/switch_status', methods=['GET'])
@cross_origin()
def switch_status():
    room_name = request.args.get('room')
    flit = {"room": room_name}
    query = myCollection.find(flit)
    this_room = query[0]
    return {"result": this_room["switch"]}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port='3000', debug=True)
