import discord
import requests
import json
import re

URL = "http://64.46.10.247:4321"

client = discord.Client()

def get_map_url(lat, lon):
  lat = str(lat)
  lon = str(lon)
  return "https://maps.googleapis.com/maps/api/staticmap?center=" + lat + "," + lon + "&zoom=16&size=600x400&maptype=roadmap&markers=color:red%7Clabel:C%7C" + lat + "," + lon + "&key=AIzaSyC62a8s8v3lZkrwI7oz_0UQ3pC-GK-E_AA"

def get_inflate_query(c, n):
  query = {
    "WHERE": {
        "AND": [
        {
            "NOT": 
            {
                "EQ": 
                {
                    "courses_year": 1900
                }
            }
        },
        {
            "NOT": 
            {
                "IS": 
                {
                    "courses_instructor": ""
                }
            }
        }, 
        {
            "IS": 
            {
                "courses_dept": c
            }
        }, 
        {
            "IS": 
            {
                "courses_id": n
            }
        }
    ]
    },
    "OPTIONS": {
      "COLUMNS": [
        "courses_instructor",
        "avg"
      ],
      "ORDER": {
        "dir": "DOWN",
        "keys": [
          "avg"
        ]
      }
    },
    "TRANSFORMATIONS": {
      "GROUP": [
        "courses_instructor"
      ],
      "APPLY": [
      {
          "avg": {
            "AVG": "courses_avg"
          }
        }
      ]
    }
  }
  return query

def get_room_query(b, n):
  query = {
    "WHERE": {
        "AND":[
          {
            "IS": {
              "rooms_shortname": b
            }
          },
          {
            "IS": {
              "rooms_number": n
            }
          }]
    },
    "OPTIONS": {
      "COLUMNS": [
        "rooms_address",
        "rooms_seats",
        "rooms_lat",
        "rooms_lon"
      ],
      "ORDER": {
        "dir": "UP",
        "keys": [
          "rooms_address"
        ]
      }
    }
  }
  return query

def inflate_gpa(c, n):
  query = get_inflate_query(c, n)
  response = requests.post(URL + "/query", json = query)
  json_data = json.loads(response.text)
  if "result" in json_data:
    if len(json_data["result"]) == 0:
      return ["This course has no valid sections."]
    out_arr = []
    str_init = f"```{'Instructor' : <30}{'Average' : ^10}\n\n"
    str_out = str_init
    for section in json_data["result"]:
      str_out += f"{section['courses_instructor'] : <30}{str(section['avg']) : ^10}\n"
      if len(str_out) > 1800:
        str_out += "```"
        out_arr.append(str_out)
        str_out = "```"
    out_arr.append(str_out + "```")
    return out_arr
  elif "error" in json_data:
    print(json_data["error"])
    return ["Error: " + json_data["error"]]
  else:
    return ["invalid server response"]

def rooms(b, n):
  query = get_room_query(b, n)
  response = requests.post(URL + "/query", json = query)
  json_data = json.loads(response.text)
  print(json_data["result"])
  if "result" in json_data:
    if len(json_data["result"]) == 0:
      return ["This room does not exist."]
    out_str = "This room is located at: **" + json_data["result"][0]["rooms_address"] + "** and has capacity: **" + str(json_data["result"][0]["rooms_seats"]) + "**"
    out_map = get_map_url(json_data["result"][0]["rooms_lat"], json_data["result"][0]["rooms_lon"])
    return [out_str, out_map]
  elif "error" in json_data:
    print(json_data["error"])
    return ["Error: " + json_data["error"]]
  else:
    return ["invalid server response"]

@client.event
async def on_ready():
  print("Logged in as {0.user}".format(client))

@client.event
async def on_message(message):
  if message.author == client.user:
    return

  msg = message.content

  if msg.startswith("!init"):
    init_response = requests.post(URL + "/init")
    init_json_data = json.loads(init_response.text)
    await message.channel.send(init_json_data["result"])

  if msg.startswith("!inflategpa "):
    content = msg.split("!inflategpa ",1)[1]
    search = re.search("^[a-zA-Z]{4}[_][0-9]{3}$", content)
    if not search:
      await message.channel.send("Invalid input format. Must be 4 letters, followed by '_', followed by 3 numbers.")
      return
    course, num = content.split("_", 1)
    course = course.lower()
    await message.channel.send("Getting averages for: "+ course+ " "+ num)
    str_arr = inflate_gpa(course, num)
    for s in str_arr:
      await message.channel.send(s)
  
  if msg.startswith("!room "):
    content = msg.split("!room ",1)[1]
    search = re.search("^[a-zA-Z]{3,4}[_][a-zA-Z0-9]{2,4}$", content)
    if not search:
      await message.channel.send("Invalid input format. Must be 3 to 4 letters, followed by '_', followed by 2 to 4 alphanumeric characters.")
      return
    building, num = content.split("_", 1)
    building = building.upper()
    num = num.upper()
    await message.channel.send("Getting room info for: "+ building + " " + num)
    out_arr = rooms(building, num)
    await message.channel.send(out_arr[0])
    if len(out_arr) == 2:
      await message.channel.send(out_arr[1])

client.run("OTE0NjkwNDE3MzE0OTIyNTQ2.YaQt1Q.uXCctKGU5pKVoyhmZSvYzgzelu8")

