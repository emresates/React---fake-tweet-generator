import { useState } from "react";
import {
  LikeIcon,
  ReplyIcon,
  RetweetIcon,
  ShareIcon,
  VerifyIcon,
} from "./components/icons";
import { AvatarLoader } from "./components/Loader";
import "./style/style.css";
import { language } from "./components/Language";
import { useEffect } from "react";

// Changes the font color of hashtags or links to blue
const tweetFormat = (tweet) => {
  tweet = tweet
    .replace(/@([\w]+)/g, "<span>@$1</span>")
    .replace(/#([\wşçöğüıİ]+)/gi, "<span>#$1</span>")
    .replace(/(https?:\/\/[\w\.\/]+)/, "<span>$1</span>");
  return tweet;
};

// Adds the letter "B" in numbers greater than 1000
const formatNumber = (number) => {
  if (!number) {
    number = 0;
  }

  if (number < 1000) {
    return number;
  }
  number /= 1000;
  number = String(number).split(".");

  return (
    number[0] + (number[1] > 100 ? "," + number[1].slice(0, 1) + " B" : " B")
  );
};

function App() {
  const [name, setName] = useState();
  const [username, setUsername] = useState();
  const [isVerified, setIsVerified] = useState(0);
  const [tweet, setTweet] = useState();
  const [avatar, setAvatar] = useState();
  const [retweets, setRetweets] = useState(0);
  const [quoteTweets, setQuoteTweets] = useState(0);
  const [likes, setLikes] = useState(0);
  const [time, setTime] = useState();
  const [date, setDate] = useState();
  const [phone, setPhone] = useState();
  const [lang, setLang] = useState("tr");
  const [langText, setLangText] = useState();

  useEffect(() => {
    setLangText(language[lang]);
  }, [lang]);

  useEffect(() => {}, [langText]);

  const avatarHandle = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.addEventListener("load", function () {
      setAvatar(this.result);
    });
    reader.readAsDataURL(file);
  };

  const fetchTwitterInfo = () => {
    fetch(
      `https://typeahead-js-twitter-api-proxy.herokuapp.com/demo/search?q=${username}`
    )
      .then((res) => res.json())
      .then((data) => {
        const twitter = data[0];
        console.log(twitter);
        setAvatar(twitter.profile_image_url_https);
        setName(twitter.name);
        setUsername(twitter.screen_name);
        setTweet(twitter.status.text);
        setRetweets(twitter.status.retweet_count);
        setLikes(twitter.status.favorite_count);
        setIsVerified(twitter.verified)

        const dateTimeChanged = () => {
          const change= twitter.status.created_at
          var dateChange = change.split(" ")
          setDate(`${dateChange[2]} ${dateChange[1]} ${dateChange[5]}`)
          var timeChange = dateChange[3].split(":")

          if (timeChange[0] > 12){
            setTime(`ÖS ${timeChange[0] % 12}:${timeChange[1]} `)
          } else {
            setTime(`ÖÖ ${timeChange[0]}:${timeChange[1]}`)
          }
        };
        dateTimeChanged()

      });
  };

  return (
    <>
      <div className="tweet-settings">
        <h3>{langText?.settings} || Scroll for More</h3>
        <ul>
          <li>
            <label>{langText?.name} :</label>
            <input
              type="text"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </li>
          <li>
            <label>{langText?.username} :</label>
            <input
              type="text"
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </li>
          <li>
            <label>Tweet :</label>
            <textarea
              className="textarea"
              maxLength="290"
              value={tweet}
              onChange={(e) => setTweet(e.target.value)}
            ></textarea>
          </li>
          <li>
            <label>Avatar :</label>
            <input
              type="file"
              className="input"
              onChange={avatarHandle}
              name="name"
            />
          </li>
          <li>
            <label>Retweet :</label>
            <input
              type="number"
              className="input"
              value={retweets}
              onChange={(e) => setRetweets(e.target.value)}
            />
          </li>
          <li>
            <label>{langText?.quote} :</label>
            <input
              type="number"
              className="input"
              value={quoteTweets}
              onChange={(e) => setQuoteTweets(e.target.value)}
            />
          </li>
          <li>
            <label>{langText?.like} :</label>
            <input
              type="number"
              className="input"
              value={likes}
              onChange={(e) => setLikes(e.target.value)}
            />
          </li>
          <li>
            <label>{langText?.verified} :</label>
            <select
              onChange={(e) => setIsVerified(e.target.value)}
              defaultValue={isVerified}
            >
              <option value="1">{langText?.yes}</option>
              <option value="0">{langText?.no}</option>
            </select>
          </li>
          <li>
            <label>{langText?.time} :</label>
            <input
              type="text"
              className="input"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </li>
          <li>
            <label>{langText?.date} :</label>
            <input
              type="text"
              className="input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </li>
          <li>
            <label>Web :</label>
            <input
              type="text"
              className="input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </li>
        </ul>
      </div>
      <div className="tweet-container">
        <div className="app-language">
          <span
            onClick={() => setLang("tr")}
            className={lang === "tr" && "active"}
          >
            Tr
          </span>
          <span
            onClick={() => setLang("en")}
            className={lang === "en" && "active"}
          >
            En
          </span>
        </div>
        <div className="fetch-info">
          <input
            type="text"
            value={username}
            placeholder={langText?.usernameTwitter}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={fetchTwitterInfo}>{langText?.info}</button>
        </div>

        <div className="tweet">
          <div className="tweet-author">
            {(avatar && <img src={avatar} />) || <AvatarLoader />}
            <div>
              <div className="name">
                {name || langText?.name}
                {isVerified == 1 && <VerifyIcon />}
              </div>
              <div className="username">@{username || langText?.username}</div>
            </div>
          </div>
          <div className="tweet-content">
            <p
              dangerouslySetInnerHTML={{
                __html: (tweet && tweetFormat(tweet)) || langText?.tweet,
              }}
            ></p>
          </div>
          <div className="tweet-date">
            <span>{time || langText?.timeD}</span>
            <span>·</span>
            <span>{date || langText?.dateD}</span>
            <span>·</span>
            <span>Twitter {phone || "for iPhone"}</span>
          </div>
          <div className="tweet-stats">
            <span>
              <b>{formatNumber(retweets)}</b> Retweet
            </span>
            <span>
              <b>{formatNumber(quoteTweets)}</b> {langText?.quote}
            </span>
            <span>
              <b>{formatNumber(likes)}</b> {langText?.like}
            </span>
          </div>
          <div className="tweet-actions">
            <span>
              <ReplyIcon />
            </span>
            <span>
              <RetweetIcon />
            </span>
            <span>
              <LikeIcon />
            </span>
            <span>
              <ShareIcon />
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
