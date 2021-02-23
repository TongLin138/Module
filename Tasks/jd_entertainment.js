/*
 * @Author: i-chenzhe https://github.com/i-chenzhe
 * @Date: 2021-02-06 16:00:00 
 * @Last Modified by: TongLin138
 * @Last Modified time: 2021-02-22 09:00:00
 */

const $ = new Env('百变大咖秀');
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const notify = $.isNode() ? require('./sendNotify') : '';
let cookiesArr = [], cookie = '', originCookie = '', message = '';
let helpAuthor = false;//为作者助力的开关
const ACT_ID = 'dz2102100001340203';
const questionList = [
  { q: '84d9ef3ccb2543449935871c2a95f2aa', a: 'B:玲花' },
  { q: '12ffa15a77c3489ca644ff0880e79343', a: 'C:鞠萍' },
  { q: '2c71328d97e6422a8181c6c025e078cc', a: 'A:管乐' },
  { q: '3e7c6a1f59e043a59bcdca9b01b4cdaa', a: 'B:汪小敏' },
  { q: '3f471e4309d7435c81604d0fe1d600b7', a: 'A:王智' },
  { q: '482efac942f64d52852e92acdf9843df', a: 'B:孙楠' },
  { q: '66e57d12ab4b4a018a3c2f6a5ebf68ba', a: 'A:曾毅' },
  { q: 'ac6c845f83844995b8501665f06fe845', a: 'B:朱婧汐' },
  { q: 'f3c17cb462de4841a0693abdee2b7815', a: 'A:黄艺馨' }
]
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => { };
} else {
  let cookiesData = $.getdata('CookiesJD') || "[]";
  cookiesData = JSON.parse(cookiesData);
  cookiesArr = cookiesData.map(item => item.cookie);
  cookiesArr.reverse();
  cookiesArr.push(...[$.getdata('CookieJD2'), $.getdata('CookieJD')]);
  cookiesArr.reverse();
  cookiesArr = cookiesArr.filter(item => !!item);
}
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });
    return;
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      await getAuthorCode('entertainment');
      await getShareCode();
      cookie = cookiesArr[i]
      originCookie = cookiesArr[i]
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      await TotalBean();
      console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });
        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      await entertainment();
    }
  }
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })
async function entertainment() {

  $.risk = false;
  $.gameScore = 0;
  await grantTokenKey();
  await $.wait(1500)
  await grantToken();
  await $.wait(1500)
  await getActCookie();
  await $.wait(1500)
  await getActInfo();
  await $.wait(1500)
  await getMyPing();
  await $.wait(1500)
  await getUserInfo();
  await $.wait(1500)
  await getActContent(false, $.userShareCode);
  if (!$.risk) {
    await $.wait(1500)
    await getActContent($.doJob);
    await $.wait(1500)
    await answer();
    await $.wait(1500)
    await getActContent(false);
    await draw();
    console.log(`好友助力码【 ${$.shareCode} 】`);
    await submitShareCode({ 'share_code': $.shareCode, 'pt_key': $.UserName });
  } else {
    if ($.isNode()) {
      await notify.sendNotify(`${$.name}运行完成`, `京东账号${$.index} ${$.nickName || $.UserName}\n京东说‘本活动与你无缘，请关注其他活动。’`);
    } else {
      await $.msg(`${$.name}运行完成`, `京东说‘本活动与你无缘，请关注其他活动。’`);
    }
  }
  if (helpAuthor) {
    new Promise(resolve => { $.get({ url: 'https://api.r2ray.com/jd.bargain/index' }, (err, resp, data) => { try { if (data) { $.dataGet = JSON.parse(data); if ($.dataGet.data.length !== 0) { let opt = { url: `https://api.m.jd.com/client.action`, headers: { 'Host': 'api.m.jd.com', 'Content-Type': 'application/x-www-form-urlencoded', 'Origin': 'https://h5.m.jd.com', 'Accept-Encoding': 'gzip, deflate, br', 'Cookie': cookie, 'Connection': 'keep-alive', 'Accept': 'application/json, text/plain, */*', 'User-Agent': 'jdapp;iPhone;9.4.0;14.3;;network/wifi;ADID/;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone10,3;addressid/;supportBestPay/0;appBuild/167541;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1', 'Referer': `https://h5.m.jd.com/babelDiy/Zeus/4ZK4ZpvoSreRB92RRo8bpJAQNoTq/index.html?serveId=wxe30973feca923229&actId=${$.dataGet.data[0].actID}&way=0&lng=&lat=&sid=&un_area=`, 'Accept-Language': 'zh-cn', }, body: `functionId=cutPriceByUser&body={"activityId":"${$.dataGet.data[0].actID}","userName":"","followShop":1,"shopId":${$.dataGet.data[0].actsID},"userPic":""}&client=wh5&clientVersion=1.0.0` }; return new Promise(resolve => { $.post(opt, (err, ersp, data) => { }) }); } } } catch (e) { console.log(e); } finally { resolve(); } }) })
  }

}

async function draw() {
  for (let i = 0; i < $.cardList.length; i++) {
    const card = $.cardList[i];
    if (card.answer === true && card.draw === false && $.canDraw === true) {
      console.log(`开始抽奖`);
      await doTask('dingzhi/change/able/startDraw', `activityId=${ACT_ID}&actorUuid=${$.shareCode}&pin=${encodeURIComponent($.secretPin)}&cardId=${card.uuid}`)
      await $.wait(1000);
    }
  }
}

async function answer() {
  await doTask('dingzhi/change/able/getHasCard', `activityId=${ACT_ID}&actorUuid=${$.shareCode}&pin=${encodeURIComponent($.secretPin)}`);
  let newPosition = [0, 1, 2, 3, 4, 5, 6, 7, 8]
  let newCardList = [];
  for (let i = 0; i < $.cardList.length; i++) {
    const v = $.cardList[i];
    if (v.position === 99) {
      newCardList.push(v)
    }
    if (v.position !== 99) {
      let key = newPosition.indexOf(v.position);
      newPosition.splice(key, 1)
    }
  }
  if (newCardList.length === 0) {
    console.log(`已经答对所有题目了。`)
    return;
  }
  for (let i = 0; i <= $.gameScore; i++) {
    let options = '';
    const tmp = questionList.filter((x) => x.q === newCardList[i].uuid);
    if (tmp && tmp[0]) {
      console.log(`在本地题库中找到了答案：${tmp[0].a}`)
      options = tmp[0].a
    }
    let body = `activityId=${ACT_ID}&actorUuid=${$.shareCode}&pin=${encodeURIComponent($.secretPin)}&uuid=${newCardList[i].uuid}&answer=${encodeURIComponent(options)}&position=${newPosition[i]}`
    await doTask('dingzhi/change/able/answer', body);
    await $.wait(1500)
  }
}
async function getActContent(done = true, authorShareCode = '') {
  return new Promise(resolve => {
    $.post(taskPostUrl('dingzhi/change/able/activityContent', `activityId=${ACT_ID}&pin=${encodeURIComponent($.secretPin)}&pinImg=${$.pinImg}&nick=${$.nickName}&cjyxPin=&cjhyPin=&shareUuid=${authorShareCode}`), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
        } else {
          data = JSON.parse(data);
          if (data.result === false) {
            $.risk = true;
            console.log(`京东说‘本活动与你无缘，请关注其他活动。’`);
            return;
          }
          $.cardScore = data.data.cardScore;
          $.shareCode = data.data.actorUuid;
          $.addSku = data.data.addSku;
          $.mainActive = data.data.mainActive;
          $.toShop = data.data.toShop;
          if (data.data.gameScore === 9) {
            $.doJob = false;
            if (data.data.drawOrNo === false && data.data.canDrawBig === true) {
              console.log(`开始抽取最终大奖。`)
              await doTask('dingzhi/change/able/startDrawBig', `activityId=${ACT_ID}&actorUuid=${$.shareCode}&pin=${escape($.secretPin)}&cardId=`)
            }
          }
          if (done) {
            for (let i of ['toShop', 'mainActive']) {
              let task = data.data[i];
              for (let vo of task.settings) {
                let body1 = `activityId=${ACT_ID}&actorUuid=${$.shareCode}&pin=${encodeURIComponent($.secretPin)}&taskType=${vo.type}&taskValue=${vo.value}`;
                let body2 = `venderId=${data.data.shopId}&elementId=${encodeURIComponent('店铺' + vo.value)}&pageId=${ACT_ID}&pin=${encodeURIComponent($.secretPin)}`;
                if (vo.type === 12) {
                  console.log(`浏览会场 - ${vo.name}`)
                  await doTask('dingzhi/change/able/saveTask', body1);
                  await $.wait(2000)
                  await doTask('crm/pageVisit/insertCrmPageVisit', body2)
                } else {
                  console.log(`浏览店铺 - ${vo.name}`)
                  await doTask('dingzhi/change/able/saveTask', body1);
                  await $.wait(2000)
                }
              }
              await $.wait(1500)
            }
            await $.wait(1500)
            await doTask('dingzhi/change/able/saveTask', `activityId=${ACT_ID}&actorUuid=${$.shareCode}&pin=${encodeURIComponent($.secretPin)}&taskType=${$.addSku.settings[0].type}&taskValue=${$.addSku.settings[0].value}`)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}
function doTask(function_name, body) {
  return new Promise(resolve => {
    $.post(taskPostUrl(function_name, body), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
        } else {
          data = JSON.parse(data);
          if (resp['headers']['set-cookie']) {
            cookie = `${resp['headers']['set-cookie'].join(';')}; ${originCookie}`;
          }
          if (data.result === true) {
            if (data.data.hasOwnProperty('gameScore')) {
              $.gameScore += data.data.gameScore;
              if (data.data.gameScore !== 0) {
                console.log(`获得1次翻牌机会`);
              }
            }
            if (data.data.hasOwnProperty('list')) {
              $.cardList = data.data.list;
            }
            if (data.data.hasOwnProperty('right')) {
              if (data.data.right === true) {
                console.log(`回答正确。`)
              }
            }
            if (data.data.hasOwnProperty('drawInfo')) {
              if (data.data.drawOk === true) {
                message += `获得${data.data.drawInfo.name}\n`
                console.log(`获得${data.data.drawInfo.name}\n`);
              } else {
                $.canDraw = false;
                console.log(`抽奖结果:${data.errorMessage}`);
                $.msg(`${$.name}\n请手动进入一次活动页面后重新尝试`);
              }
            }
          } else {
            console.log(data.errorMessage)
          }
        }
      } catch (e) {
        console.log(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
function getAuthorCode(type) {
  return new Promise(async resolve => {
    $.get({ url: `https://api.r2ray.com/jd.shareCode/author?type=${type}` }, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data.data.length > 0) {
              $.authorShareCode = data.data[0].share_code
            } else {
              $.authorShareCode = '';
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}
function getUserInfo() {
  return new Promise(resolve => {
    let body = `pin=${encodeURIComponent($.secretPin)}`
    $.post(taskPostUrl('wxActionCommon/getUserInfo', body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
        } else {
          data = JSON.parse(data);
          if (data.data) {
            console.log(`用户【${data.data.nickname}】信息获取成功`)
            $.userId = data.data.id
            $.pinImg = data.data.yunMidImageUrl
            $.nickName = data.data.nickame
          } else {
            console.log(data);
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}
function getMyPing() {
  return new Promise(resolve => {
    $.post(taskPostUrl('customer/getMyPing', `userId=${$.shopId}&token=${$.token}&fromType=APP`), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
        } else {
          data = JSON.parse(data);
          if (data.result) {
            $.secretPin = data.data.secretPin
            cookie = `AUTH_C_USER=${$.secretPin};${cookie}`
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
function getActInfo() {
  return new Promise(resolve => {
    $.post(taskPostUrl('dz/common/getSimpleActInfoVo', `activityId=${ACT_ID}`), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
        } else {
          data = JSON.parse(data);
          if (data.result) {
            $.shopId = data.data.shopId
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}
function grantTokenKey() {
  let opt = {
    url: 'https://api.m.jd.com/client.action?functionId=genToken',
    headers: {
      'Host': 'api.m.jd.com',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': '*/*',
      'Connection': 'keep-alive',
      'Cookie': cookie,
      'User-Agent': 'JD4iPhone/167551 (iPhone; iOS 14.5; Scale/3.00)',
      'Accept-Language': 'en-US;q=1, zh-Hans-US;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
    },
    body: `body=%7B%22to%22%3A%22https%3A%5C%2F%5C%2Flzdz-isv.isvjcloud.com%5C%2Fdingzhi%5C%2Fchange%5C%2Fable%5C%2Factivity%3FactivityId%3Ddz2102100001340203%22%2C%22action%22%3A%22to%22%7D&build=167538&client=apple&clientVersion=9.3.8&openudid=b9b73293715e562295c0f0aac9d15035ea9b4889&sign=55a872906641d1ed946a1ba3458ebee9&st=1612496164952&sv=110`
  }
  return new Promise(resolve => {
    $.post(opt, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
        }
        else {
          data = JSON.parse(data);

          if (data.code === '0') {
            $.tokenKey = data.tokenKey;
            cookie = `${cookie}IsvToken=${$.tokenKey}`
          }
        }
      } catch (e) {
        console.log(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
function grantToken() {
  let opt = {
    url: 'https://api.m.jd.com/client.action?functionId=isvObfuscator',
    headers: {
      'Host': 'api.m.jd.com',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': '*/*',
      'Connection': 'keep-alive',
      'Cookie': cookie,
      'User-Agent': 'JD4iPhone/167551 (iPhone; iOS 14.5; Scale/3.00)',
      'Accept-Language': 'en-US;q=1, zh-Hans-US;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
    },
    body: `body=%7B%22url%22%3A%22https%3A%5C%2F%5C%2Flzdz-isv.isvjcloud.com%22%2C%22id%22%3A%22%22%7D&build=167538&client=apple&clientVersion=9.3.8&openudid=b9b73293715e562295c0f0aac9d15035ea9b4889&sign=4570aecadf16cfa7aa934a7c611f520b&st=1612496167365&sv=100`
  }
  return new Promise(resolve => {
    $.post(opt, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
        }
        else {
          data = JSON.parse(data);
          if (data.code === '0') {
            $.token = data.token;
          }
        }
      } catch (e) {
        console.log(e)
      } finally {
        resolve();
      }
    })
  })
}
function getActCookie() {
  let opt = {
    url: `https://lzdz-isv.isvjcloud.com/dingzhi/change/able/activity?activityId=${ACT_ID}`,
    headers: {
      'Content-Type': 'text/plain',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Connection': 'keep-alive',
      'Cookie': `${cookie}`,
      'User-Agent': 'jdapp;iPhone;9.4.2;14.5;bf1f9a94239880f59a8f3b018a3aadf380e216fc;network/wifi;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone10,3;addressid/1065702877;supportBestPay/0;appBuild/167551;jdSupportDarkMode/0;pv/522.13;apprpd/MyJD_MyActivity;ref/MyJdGameToolController;psq/12;ads/;psn/bf1f9a94239880f59a8f3b018a3aadf380e216fc|591;jdv/0|kong|t_1001707023_|jingfen|fb9e8e2760454a0284a698610d76edd3|1613797291324|1613797292;adk/;app_device/IOS;pap/JA2015_311210|9.4.2|IOS 14.5;Mozilla/5.0 (iPhone; CPU iPhone OS 14_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1',
      'Accept-Language': 'en-US;q=1, zh-Hans-US;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
    }
  }
  return new Promise(resolve => {
    $.get(opt, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
        }
        else {
          cookie = `${cookie};`
          if ($.isNode())
            for (let sk of resp['headers']['set-cookie']) {
              cookie = `${cookie}${sk.split(";")[0]};`
            }
          else {
            for (let ck of resp['headers']['Set-Cookie'].split(',')) {
              cookie = `${cookie}${ck.split(";")[0]};`
            }
          }
        }
      } catch (e) {
        console.log(e)
      } finally {
        resolve();
      }
    })
  })
}
function taskPostUrl(function_id, body) {
  return {
    url: `https://lzdz-isv.isvjcloud.com/${function_id}`,
    headers: {
      'Host': 'lzdz-isv.isvjcloud.com',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'Accept-Language': 'en-us',
      'Accept-Encoding': 'gzip, deflate, br',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Origin': 'https://lzdz-isv.isvjcloud.com',
      'Connection': 'keep-alive',
      'Referer': `https://lzdz-isv.isvjcloud.com/dingzhi/change/able/activity?activityId=${ACT_ID}`,
      'Cookie': `${cookie}`,
      'User-Agent': 'jdapp;iPhone;9.4.2;14.5;bf1f9a94239880f59a8f3b018a3aadf380e216fc;network/wifi;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone10,3;addressid/1065702877;supportBestPay/0;appBuild/167551;jdSupportDarkMode/0;pv/522.13;apprpd/MyJD_MyActivity;ref/MyJdGameToolController;psq/12;ads/;psn/bf1f9a94239880f59a8f3b018a3aadf380e216fc|591;jdv/0|kong|t_1001707023_|jingfen|fb9e8e2760454a0284a698610d76edd3|1613797291324|1613797292;adk/;app_device/IOS;pap/JA2015_311210|9.4.2|IOS 14.5;Mozilla/5.0 (iPhone; CPU iPhone OS 14_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1',
    },
    body: body,
  }
}
function getShareCode() {
  return new Promise(async resolve => {
    $.get({ url: `https://api.r2ray.com/jd.entertainment/index` }, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
        } else {
          if (data) {
            data = JSON.parse(data)
            if (data.data.length > 0) {
              $.userShareCode = data.data[0].share_code
            } else {
              $.userShareCode = '';
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}
function submitShareCode(body) {
  let opt = {
    'url': `https://api.r2ray.com/jd.entertainment/update`,
    'headers': {
      "Content-Type": "application/json",
    },
    'body': JSON.stringify(body)
  }
  return new Promise(async resolve => {
    $.post(opt, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          console.log(data.msg)
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}
function TotalBean() {
  return new Promise(async resolve => {
    const options = {
      "url": `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
      "headers": {
        "Accept": "application/json,text/plain, */*",
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-us",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "Referer": "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : "jdapp;iPhone;9.4.2;14.5;bf1f9a94239880f59a8f3b018a3aadf380e216fc;network/wifi;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone10,3;addressid/1065702877;supportBestPay/0;appBuild/167551;jdSupportDarkMode/0;pv/522.13;apprpd/MyJD_MyActivity;ref/MyJdGameToolController;psq/12;ads/;psn/bf1f9a94239880f59a8f3b018a3aadf380e216fc|591;jdv/0|kong|t_1001707023_|jingfen|fb9e8e2760454a0284a698610d76edd3|1613797291324|1613797292;adk/;app_device/IOS;pap/JA2015_311210|9.4.2|IOS 14.5;Mozilla/5.0 (iPhone; CPU iPhone OS 14_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1") : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.2;14.5;bf1f9a94239880f59a8f3b018a3aadf380e216fc;network/wifi;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone10,3;addressid/1065702877;supportBestPay/0;appBuild/167551;jdSupportDarkMode/0;pv/522.13;apprpd/MyJD_MyActivity;ref/MyJdGameToolController;psq/12;ads/;psn/bf1f9a94239880f59a8f3b018a3aadf380e216fc|591;jdv/0|kong|t_1001707023_|jingfen|fb9e8e2760454a0284a698610d76edd3|1613797291324|1613797292;adk/;app_device/IOS;pap/JA2015_311210|9.4.2|IOS 14.5;Mozilla/5.0 (iPhone; CPU iPhone OS 14_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
      }
    }
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data['retcode'] === 13) {
              $.isLogin = false; //cookie过期
              return
            }
            $.nickName = data['base'].nickname;
          } else {
            console.log(`京东服务器返回空数据`)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}


// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}