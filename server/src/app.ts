require('module-alias/register');
import express from 'express';
import cors from 'cors';
const app = express();
import JSON5 from 'json5';
import fs from 'fs';

const config = JSON5.parse(fs.readFileSync('./app.config.json5', 'utf-8'));

app.use(cors());
type TemplateOptions = {
  note?: string;
};
const template = (url: string, { note }: TemplateOptions) => `

<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>正在跳转...</title>
    <link
      href="https://cdn.bootcdn.net/ajax/libs/tailwindcss/2.2.19/tailwind.min.css"
      rel="stylesheet"
    />

    <style>
      #main {
        position: absolute;
        width: 500px;
        top: 20%;
        min-height: 200px;
        left: 0;
        right: 0;
        margin: auto;
      }

      #Time {
        font-size: 25px;
        text-align: center;
        color: red;
      }

      .boxs {
        text-align: center;
        margin: 0 auto;
      }
      #Font {
        font-size: 20px;
        text-align: center;
      }
    </style>
  </head>
  <body style="display: flex">
    <div id="main" class="max-w-sm rounded overflow-hidden shadow-lg">
      <div
        class="flex justify-center items-center bg-blue-500 text-white text-sm font-bold px-4 py-3"
        role="alert"
      >
        <svg
          class="fill-current w-4 h-4 mr-2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path
            d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z"
          />
        </svg>

        <p>短链接跳转中。。。</p>
      </div>
      <div class="flex justify-center items-center px-4 py-3">
        <span class="text-xl font-bold"
          >本页面将在<span id="Time">3</span>秒之后跳转到新页面！<u>
            <a id="cancel" class="text-xs">取消跳转</a></u
          ></span
        >
      </div>
      <div class="font-sans flex justify-center text-center" id="link-url">${url}</div>
      <div class="font-sans flex justify-center text-center">${ note || ''}</div>
      <div class="flex justify-center items-center text-xs px-4 py-3">
        <span>
          如未成功跳转，请
          <a class="font-bold" id="toPage">点击这里</a>跳转
        </span>
      </div>
    </div>
  </body>
  <script>
    window.onload = () => {
      replaceInfo();
      init();
      document.querySelector('#cancel').addEventListener('click', cancel);
      document.querySelector('#toPage').addEventListener('click', toPage);
      document.querySelector('#link-url').addEventListener('click', toPage);
    };
    let timer = null;
    function init() {
      // 1000毫秒调用一次
      timer = setInterval('countDown()', 1000);
    }
    function toPage() {
      const LinkUrl = document.querySelector('#link-url');
      const l = LinkUrl.innerHTML;
      window.open(l);
      clearInterval(timer);
      timer = null;
    }
    function cancel() {
      clearInterval(timer);
      timer = null;
      console.log('已经取消');
      return;
    }
    function replaceInfo() {
      const rep = 'https://github.com/abearxiong';
      const a = document.querySelector('#main').innerHTML.includes('{url}');
      if (a) {
        let r = document
          .querySelector('#main')
          .innerHTML.replaceAll('${url}', rep);
        r = r.replace("${ note || ''}", '');
        document.querySelector('#main').innerHTML = r;
      }
    }
    function countDown() {
      //获取初始时间
      var time = document.getElementById('Time');
      //获取到id为time标签中的数字时间
      if (time.innerHTML == 0) {
        toPage();
      } else {
        time.innerHTML = time.innerHTML - 1;
      }
    }
  </script>
</html>



`;
app.get('/', function (_req, res) {
  const r = `
  简单的短链服务器
  <pre>${JSON.stringify(config, null, 2)}</pre>
  `;
  res.send(r);
});
app.get('/:link', function (req, res, next) {
  const query = req.params;
  const links = config.links;
  const link = query?.link;
  if (link) {
    const u = links.find((item) => item.link === link);
    if (u?.value) {
      const html = template(u.value, { note: u.note });
      return res.send(html);
    }
  }
  res.send('未发现');
});

// app.route('/*').get((req, res) => {
//   res.sendFile(path.resolve(__dirname, '/public/index.html'));
// });
app.listen(3010, () => {
  console.log(`listen to http://localhost:3010`);
});
