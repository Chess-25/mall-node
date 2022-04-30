import json
import requests
import os
import ast
import simplejson

def request_data(params):
  base_url = 'http://123.207.32.32:8000/api/m3'
  res = requests.get(base_url + params)
  res_contnet = res.content.decode("gbk")
  return res_contnet


data_file = open("./pop_page1.json", 'r', encoding='utf-8')
data_result = json.load(data_file)
good_list = ((data_result['data'])['list'])
for goods in good_list:
  iid = goods['iid']
  res_contnet = request_data('/detail?iid=' + iid)
  # print(res_contnet)
  ret_dict = simplejson.loads(res_contnet)
  print(ret_dict)

