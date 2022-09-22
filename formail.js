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

  var arr = [];

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
  // 12月をクリック
  await driver.findElement(By.xpath('//*[@id="list_box"]/table[2]/tbody/tr/td[4]/table/tbody/tr[8]/td/ul/li[2]/a')).click();


  //12月29日
  await driver.findElement(By.xpath('//*[@id="calendar"]/div/ul[2]/li[33]')).click();


  //午前
  await driver.findElement(By.xpath('//*[@id="seat-list"]/div[2]/button')).click();

  for (i = 1; i < 3; i++) {
    text = await driver.findElement(By.xpath('//*[@id="seat-content-202212291215"]/a[' + i + ']/div/p[2]/div')).getText();

    if (text != "×") {
      arrtext = await driver.findElement(By.xpath('//*[@id="seat-list"]/div[2]/button/span')).getText() + " " + await driver.findElement(By.xpath('//*[@id="seat-content-202212291215"]/a[' + i + ']/div/p[1]/span')).getText();

      arr.push(arrtext);
    }
  }
  //午後
  await driver.findElement(By.xpath('//*[@id="seat-list"]/div[3]/button')).click();
  for (i = 1; i < 3; i++) {
    text = await driver.findElement(By.xpath('//*[@id="seat-content-202212291815"]/a[' + i + ']/div/p[2]/div')).getText();

    if (text != "×") {
      arrtext = await driver.findElement(By.xpath('//*[@id="seat-list"]/div[2]/button/span')).getText() + " " + await driver.findElement(By.xpath('//*[@id="seat-content-202212291815"]/a[' + i + ']/div/p[1]/span')).getText();
      arr.push(arrtext);
    }
  }

  //12月30日
  await driver.findElement(By.xpath('//*[@id="calendar"]/div/ul[2]/li[34]')).click();

  //午前
  //await driver.findElement(By.xpath('//*[@id="seat-list"]/div[2]/button')).click(); ←開きっぱなしのためクリックしない
  for (i = 1; i < 3; i++) {
    text = await driver.findElement(By.xpath('//*[@id="seat-content-202212301215"]/a[' + i + ']/div/p[2]/div')).getText();

    if (text != "×") {
      arrtext = await driver.findElement(By.xpath('//*[@id="seat-list"]/div[2]/button/span')).getText() + " " + await driver.findElement(By.xpath('//*[@id="seat-content-202212301215"]/a[' + i + ']/div/p[1]/span')).getText();
      arr.push(arrtext);
    }
  }


  //最初に戻る
  await driver.findElement(By.xpath('//*[@id="contents_wrapper"]/table[3]/tbody/tr/td[2]/a')).click();

  // 1月をクリック
  await driver.findElement(By.xpath('//*[@id="list_box"]/table[2]/tbody/tr/td[5]/table/tbody/tr[8]/td/ul/li[2]/a')).click();

  //1月4日
  await driver.findElement(By.xpath('//*[@id="calendar"]/div/ul[2]/li[4]')).click();

  //午前
  await driver.findElement(By.xpath('//*[@id="seat-list"]/div[2]/button')).click();
  for (i = 1; i < 3; i++) {
    text = await driver.findElement(By.xpath('//*[@id="seat-content-202301041215"]/a[' + i + ']/div/p[2]/div')).getText();

    if (text != "×") {
      arrtext = await driver.findElement(By.xpath('//*[@id="seat-list"]/div[2]/button/span')).getText() + " " + await driver.findElement(By.xpath('//*[@id="seat-content-202301041215"]/a[' + i + ']/div/p[1]/span')).getText();

      //枚数確認
      await driver.findElement(By.xpath('//*[@id="seat-list"]/div[2]/button/span')).getText() + " " + await driver.findElement(By.xpath('//*[@id="seat-content-202301041215"]/a[' + i + ']/div/p[1]/span')).click();
      arr.push(arrtext);
    }
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