import React from "react";
import styles from "./styles.module.scss";
import { useNavigate } from "react-router-dom";
import Paths from "../../routing/Paths";
import { SiGoogleplay } from "react-icons/si";
import { FaAppStoreIos } from "react-icons/fa";

const RegisterPage = () => {
  const navigate = useNavigate();
  const handleNavigate = (path: string) => {
    if (path === "register") {
      navigate(Paths.REGISTER_FORM);
    } else if (path === "login") {
      navigate(Paths.LOGIN);
    }
  };
  return (
    <div className={styles["register-page-container"]}>
      <div className={styles.hero}>
        <div className={styles["intro-container"]}>
          <h1>Raket</h1>
          <h3>
            Benzersiz bir tenis deneyimi: Maçlar, eğitimler, kort
            rezervasyonları ve daha fazlası, hepsi bir arada.
          </h3>
          <div className={styles["buttons-container"]}>
            <button onClick={() => handleNavigate("login")}>Giriş Yap</button>
            <button onClick={() => handleNavigate("register")}>Kayıt Ol</button>
          </div>
          <div className={styles["mobile-container"]}>
            <SiGoogleplay className={styles.mobile} />
            <FaAppStoreIos className={styles.mobile} />
          </div>
        </div>
        <img className={styles["hero"]} src="/images/hero/court6.jpeg" />
      </div>

      <div className={styles["register-container"]}>
        <div className={styles["user-types"]}>
          <div className={styles["user-type"]}>
            <h4>Oyuncu</h4>
            <p>
              Antreman ve maç yap, kulüplere üye ol, liderlik tablosunda yüksel
            </p>
            <button onClick={() => handleNavigate("register")}>
              Oyuncu Olarak Katıl
            </button>
          </div>

          <div className={styles["user-type"]}>
            <h4>Eğitmen</h4>
            <p>
              Bireysel ve grup dersleri ver, kolayca ödeme al, kariyerinde
              ilerle
            </p>
            <button onClick={() => handleNavigate("register")}>
              Eğitmen Olarak Katıl
            </button>
          </div>

          <div className={styles["user-type"]}>
            <h4>Kulüp</h4>
            <p>
              Kortlarını, üyeliklerini ve çalışanlarını tek platformdan yönet
            </p>
            <button onClick={() => handleNavigate("register")}>
              Kulüp Olarak Katıl
            </button>
          </div>
        </div>
      </div>
      <div>
        <div className={styles["player-container"]}>
          <div className={styles["text-container"]}>
            <h4>Oyuncu</h4>
            <h5>Kusursuz Tenis Deneyimi</h5>
            <p>
              Raket ile tenis kariyerinizde yeni bir seviyeye çıkın! Antrenman
              ve maç davetleri gönderin, özel ders taleplerinde bulunun ve
              kortları kolayca rezerve edin. Kort ücretini arkadaşlarınızla
              paylaşma imkanını da unutmayın. Ayrıca, kulüplere abone olarak
              daha fazla avantaja sahip olabilirsiniz.
            </p>
            <ul>
              <li>Diğer oyunculara antrenman ve maç davetleri gönderin</li>
              <li>Eğitmenlerle özel dersler için taleplerde bulunun</li>
              <li>Kort rezervasyonu yapın ve ücreti paylaşın</li>
              <li>Kulüplere üye olun ve özel avantajlardan yararlanın</li>
              <li>Liderlik tablosunda sıralamanızı takip edin</li>
            </ul>
          </div>
          <img src="/images/hero/hero_landing.png" />
        </div>
        <div className={styles["trainer-container"]}>
          <div className={styles["text-container"]}>
            <h4>Eğitmen</h4>
            <h5>Eksiksiz Eğitim Yönetimi</h5>
            <p>
              Raket Platformu, eğitmenlerin kariyerlerini kolayca
              yönetebilmeleri için tasarlandı. Kulüplere katılabilir ya da
              bağımsız çalışabilirsiniz. Özel ve grup dersleri verin, ders
              davetleri gönderin ve kazançlarınızı anında alın. Takvim, ödemeler
              ve geçmiş etkinliklerinizi takip ederek daha verimli çalışın.
            </p>
            <ul>
              <li>Kulüplere katılın ya da bağımsız çalışın</li>
              <li>Özel ve grup dersleri verin</li>
              <li>Oyunculara ders davetleri gönderin</li>
              <li>Anında ödeme alın, komisyon yok</li>
              <li>Takvim, ödemeler ve geçmiş etkinliklerinizi takip edin</li>
            </ul>
          </div>
          <img src="/images/hero/hero_landing2.png" />
        </div>
        <div className={styles["club-container"]}>
          <div className={styles["text-container"]}>
            <h4>Kulüp</h4>
            <h5>Kulüpler için Akıllı Çözümler</h5>
            <p>
              Raket Platformu ile kulübünüzü dijitalleştirin ve kolayca yönetin.
              Kortlarınızı sisteme ekleyin, oyuncular ve eğitmenler tarafından
              rezerve edilmesini sağlayın. Abonelik paketleri oluşturun ve
              anında ödeme alın. İsterseniz platformu sadece aboneleriniz için
              kapalı bir ortam olarak kullanın.
            </p>
            <ul>
              <li>
                Kortlarınızı sisteme ekleyin ve rezerve edilmelerini sağlayın
              </li>
              <li>Abonelik paketleri oluşturun ve yönetin</li>
              <li>Anında ödeme alın, komisyon yok</li>
              <li>Platformu kapalı bir ortam olarak kullanma imkanı</li>
              <li>Kulüp kurallarını belirleyin ve yönetimi kolaylaştırın</li>
            </ul>
          </div>
          <img src="/images/hero/hero_landing3.png" />
        </div>
      </div>
    </div>
  );
};
export default RegisterPage;
