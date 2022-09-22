const { Builder, By, Capabilities, Key, until } = require('selenium-webdriver')
const capabilities = Capabilities.chrome()
// Chrome起動時のオプションを指定
capabilities.set('chromeOptions', {
  args: [
    '--headless',
    '--disable-gpu',
    '--window-size=1024,768'
  ],
  w3c: false
})

// awaitを使うので、asyncで囲む
const searchTicket = async () => {

  //ブラウザ立ち上げ
  const driver = await new Builder()
    .withCapabilities(capabilities)
    .build()

  // 紹介サイトを開く
  await driver.get('https://harrypotter.horipro-stage.jp/');
  //予約サイトに飛ぶ
  await driver.findElement(By.xpath("/html/body/main/div/section[2]/ul/li[1]/a")).click();


  // 別タブに移動
  const tabs = await driver.getAllWindowHandles();
  await driver.switchTo().window(tabs[1]);

  var arr = [];

  //numは1=>１公演 2=>2公演 3=>午前 4=>午後
  //12月の配列
  var decArr = [
    { "li": "32", "date": "20221228", "num": 2 },
    { "li": "33", "date": "20221229", "num": 2 },
    { "li": "34", "date": "20221230", "num": 1 }
  ]
  //1月の配列
  var janArr = [
    { "li": "4", "date": "20230104", "num": 3 },
    { "li": "5", "date": "20230105", "num": 1 },
  ]

  // 12月をクリック
  await driver.findElement(By.xpath('//*[@id="list_box"]/table[2]/tbody/tr/td[4]/table/tbody/tr[8]/td/ul/li[2]/a')).click();


  textarr = await emptySearch(driver, decArr);
  if (textarr != "") {
    textarr.forEach(element => {
      arr.push(element);
    });
  }

  //最初に戻る
  await driver.findElement(By.xpath('//*[@id="contents_wrapper"]/table[3]/tbody/tr/td[2]/a')).click();
  // 1月をクリック
  await driver.findElement(By.xpath('//*[@id="list_box"]/table[2]/tbody/tr/td[5]/table/tbody/tr[8]/td/ul/li[2]/a')).click();

  textarr = await emptySearch(driver, janArr);
  if (textarr != "") {
    textarr.forEach(element => {
      arr.push(element);
    });
  }
  
  if (arr.length > 0) {
    //メール文の生成
    mailtext="呪いの子のチケットの空き情報です。\r\n"
    arr.forEach(element => {
        mailtext+=element+"\r\n";
    });
    
    //メール送信
    //nodemailer読みこみ
    const nodemailer = require("nodemailer");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
        // メールアドレス
        user: "gmailのアドレス",
        pass: "gmailの認証のパス",
      },
    });
    
    transporter.sendMail({
      from: "アドレス",
      to: "アドレス",
      subject: "呪いの子のチケットが空きました",
      text: mailtext,
    }, function (error, info) {
      if (error) {
        console.error(error);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    });


  }
  // ブラウザ終了
  driver.quit();

}

searchTicket();

const emptySearch = async (driver, dateArr) => {

  arr = [];
  for (i = 0; i < dateArr.length; i++) {
    await driver.findElement(By.xpath('//*[@id="calendar"]/div/ul[2]/li[' + dateArr[i]['li'] + ']')).click();
    console.log(i);
    if (dateArr[i]['num'] != 1) {
      await driver.findElement(By.xpath('//*[@id="seat-list"]/div[2]/button')).click();

    }

    if (dateArr[i]['num'] != 4) {  //午前
      for (j = 1; j < 3; j++) {
        text = await driver.findElement(By.xpath('//*[@id="seat-content-' + dateArr[i]['date'] + '1215"]/a[' + j + ']/div/p[2]/div')).getText();

        if (text != "×") {
          arrtext = await driver.findElement(By.xpath('//*[@id="seat-list"]/div[2]/button/span')).getText() + " " + await driver.findElement(By.xpath('//*[@id="seat-content-' + dateArr[i]['date'] + '1215"]/a[' + j + ']/div/p[1]/span')).getText();
          arr.push(arrtext);

        }
      }
    }
    if (dateArr[i]['num'] == 2 || dateArr[i]['num'] == 4) {  //午後
      await driver.findElement(By.xpath('//*[@id="seat-list"]/div[3]/button')).click();
      for (j = 1; j < 3; j++) {
        text = await driver.findElement(By.xpath('//*[@id="seat-content-' + dateArr[i]['date'] + '1815"]/a[' + j + ']/div/p[2]/div')).getText();

        if (text != "×") {
          arrtext = await driver.findElement(By.xpath('//*[@id="seat-list"]/div[2]/button/span')).getText() + " " + await driver.findElement(By.xpath('//*[@id="seat-content-' + dateArr[i]['date'] + '1815"]/a[' + j + ']/div/p[1]/span')).getText();
          arr.push(arrtext);
        }
      }
    }


  }
  return arr;
}