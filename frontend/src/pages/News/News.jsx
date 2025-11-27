import { Link } from "react-router-dom";
import "../Home/home.css";
import "./news.css";
import { useAuth } from "../../context/AuthContext";

const FEATURED = {
  title: "Ra mắt tuyến Sài Gòn - Buôn Ma Thuột ban đêm",
  summary:
    "Hành khách giờ đây có thêm lựa chọn khởi hành 22h mỗi ngày với giường nằm cabin và dịch vụ trung chuyển tận nơi.",
  tag: "Tuyến mới",
  date: "27/11/2025",
};

const ARTICLES = [
  {
    title: "Ưu đãi Black Friday giảm 30% vé khứ hồi",
    summary:
      "Đặt vé từ 25-30/11, nhập mã BLACKFRIDAY để được giảm tối đa 120.000đ cho mọi tuyến đường xa.",
    tag: "Khuyến mãi",
    date: "25/11/2025",
  },
  {
    title: "Cập nhật quy định hành lý cuối năm",
    summary:
      "Mỗi hành khách được mang 01 kiện 15kg miễn phí. Vui lòng báo trước với tổng đài nếu mang vật dụng cồng kềnh.",
    tag: "Thông báo",
    date: "22/11/2025",
  },
  {
    title: "Nâng cấp trạm trung chuyển Đà Nẵng",
    summary:
      "Không gian phòng chờ mới với khu vực làm việc, nước uống miễn phí và cổng sạc cho khách đi đường dài.",
    tag: "Hạ tầng",
    date: "20/11/2025",
  },
];

const INSIGHTS = [
  {
    title: "Bí kíp săn vé Tết chủ động",
    summary:
      "Đặt trước tối thiểu 45 ngày, sử dụng tính năng nhắc chuyến và chọn thanh toán online để giữ chỗ nhanh nhất.",
  },
  {
    title: "Kinh nghiệm mang thú cưng an toàn",
    summary:
      "Chuẩn bị sổ tiêm, lồng tiêu chuẩn và báo trước với tổng đài để được sắp xếp vị trí phù hợp.",
  },
  {
    title: "Gợi ý hành trình 3N2Đ Đà Lạt",
    summary:
      "Combo xe giường nằm + khách sạn trung tâm, khám phá đồi chè Cầu Đất và thưởng thức ẩm thực bản địa.",
  },
];

export default function News() {
  const { isAuthed, fullName, logout } = useAuth();

  return (
    <div className="news-page">
      <header className="ld-header">
        <div className="ld-header-inner">
          <Link to="/" className="ld-logo">
            <div className="ld-logo-square">LD</div>
            <div className="ld-logo-text">
              <div className="ld-logo-title">Long Distance Bus</div>
              <div className="ld-logo-subtitle">Cùng bạn trên mọi nẻo đường dài</div>
            </div>
          </Link>

          <nav className="ld-nav">
            <Link to="/" className="ld-nav-link">
              Trang chủ
            </Link>
            <span className="ld-nav-link">Lịch trình</span>
            <span className="ld-nav-link">Tra cứu vé</span>
            <span className="ld-nav-link ld-nav-link--active">Tin tức</span>
            <span className="ld-nav-link">Hóa đơn</span>
            <span className="ld-nav-link">Liên hệ</span>
            <span className="ld-nav-link">Về chúng tôi</span>
          </nav>

          <div className="ld-header-auth">
            {isAuthed ? (
              <div className="ld-user-chip">
                <div className="ld-user-avatar">
                  {fullName ? fullName.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="ld-user-info">
                  <div className="ld-user-name">{fullName || "Người dùng"}</div>
                  <button type="button" className="ld-user-logout" onClick={logout}>
                    Đăng xuất
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link to="/login" className="ld-header-btn ld-header-btn--ghost">
                  Đăng nhập
                </Link>
                <Link to="/register" className="ld-header-btn ld-header-btn--solid">
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <header className="news-hero">
        <div className="news-hero-content">
          <span className="news-eyebrow">Long Distance Bus Newsroom</span>
          <h1>Cập nhật hành trình, ưu đãi và câu chuyện đường dài</h1>
          <p>
            Bắt kịp thông tin mới nhất từ đội ngũ Long Distance Bus: tuyến xe vừa khai
            trương, ưu đãi đang diễn ra và những kinh nghiệm du lịch hữu ích dành cho bạn.
          </p>
          <div className="news-hero-actions">
            <Link to="/" className="news-btn news-btn--light">
              ⬅ Về trang chủ
            </Link>
            <a href="#latest" className="news-btn news-btn--primary">
              Tin mới nhất
            </a>
          </div>
        </div>
        <div className="news-hero-illustration">
          <div className="news-badge">Tin nóng</div>
          <div className="news-hero-card">
            <p>{FEATURED.date}</p>
            <h3>{FEATURED.title}</h3>
            <span>{FEATURED.tag}</span>
          </div>
        </div>
      </header>

      <main className="news-content">
        <section id="latest" className="news-featured">
          <div className="news-featured-text">
            <span className="news-tag">{FEATURED.tag}</span>
            <p className="news-date">{FEATURED.date}</p>
            <h2>{FEATURED.title}</h2>
            <p>{FEATURED.summary}</p>
            <button className="news-link">Đọc chi tiết</button>
          </div>
          <div className="news-featured-image" aria-hidden>
            <div className="news-featured-placeholder">🚌</div>
            <span>Tuyến đặc biệt</span>
          </div>
        </section>

        <section className="news-grid">
          {ARTICLES.map((article) => (
            <article key={article.title} className="news-card">
              <span className="news-tag news-tag--soft">{article.tag}</span>
              <p className="news-date">{article.date}</p>
              <h3>{article.title}</h3>
              <p>{article.summary}</p>
              <button className="news-link">Xem thêm</button>
            </article>
          ))}
        </section>

        <section className="news-insights">
          <div className="news-insights-header">
            <div>
              <span className="news-eyebrow">Góc kinh nghiệm</span>
              <h2>Chuẩn bị hành trình chủ động</h2>
            </div>
            <button className="news-btn news-btn--ghost">Xem tất cả</button>
          </div>
          <div className="news-insights-grid">
            {INSIGHTS.map((item) => (
              <article key={item.title} className="news-insight-card">
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <button className="news-link">Đọc ngay</button>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
