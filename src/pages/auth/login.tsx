import {
  Button,
  Divider,
  Form,
  Input,
  message,
  notification,
  Modal,
} from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { callLogin } from "config/api";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserLoginInfo } from "@/redux/slice/accountSlide";
import styles from "styles/auth.module.scss";
import { useAppSelector } from "@/redux/hooks";
import axios from "axios";
import instance from "@/config/axios-customize";

const LoginPage = () => {
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);
  const [isForgotPasswordVisible, setIsForgotPasswordVisible] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const dispatch = useDispatch();
  const isAuthenticated = useAppSelector(
    (state) => state.account.isAuthenticated
  );

  let location = useLocation();
  let params = new URLSearchParams(location.search);
  const callback = params?.get("callback");

  useEffect(() => {
    //đã login => redirect to '/'
    if (isAuthenticated) {
      window.location.href = "/";
    }
  }, []);

  const onFinish = async (values: any) => {
    const { username, password } = values;
    setIsSubmit(true);
    const res = await callLogin(username, password);
    setIsSubmit(false);
    if (res?.data) {
      localStorage.setItem("access_token", res.data.access_token);
      dispatch(setUserLoginInfo(res.data.user));
      message.success("Đăng nhập tài khoản thành công!");
      window.location.href = callback ? callback : "/";
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description:
          res.message && Array.isArray(res.message)
            ? res.message[0]
            : res.message,
        duration: 5,
      });
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotPasswordEmail) {
      return message.error("Vui lòng nhập email!");
    }
    try {
      const response = await instance.post("/api/v1/auth/forgot-password", {
        email: forgotPasswordEmail,
      });
      message.success("Yêu cầu đặt lại mật khẩu đã được gửi!");
      setForgotPasswordEmail("");
      setIsForgotPasswordVisible(false);
    } catch (error: any) {
      message.error(
        error.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại."
      );
    }
  };

  return (
    <div className={styles["login-page"]}>
      <main className={styles.main}>
        <div className={styles.container}>
          <section className={styles.wrapper}>
            <div className={styles.heading}>
              <h2 className={`${styles.text} ${styles["text-large"]}`}>
                Đăng Nhập
              </h2>
              <Divider />
            </div>
            <Form name="basic" onFinish={onFinish} autoComplete="off">
              <Form.Item
                labelCol={{ span: 24 }} //whole column
                label="Email"
                name="username"
                rules={[
                  { required: true, message: "Email không được để trống!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                labelCol={{ span: 24 }} //whole column
                label="Mật khẩu"
                name="password"
                rules={[
                  { required: true, message: "Mật khẩu không được để trống!" },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={isSubmit}>
                  Đăng nhập
                </Button>
              </Form.Item>
              <Divider>Or</Divider>
              <p className="text text-normal">
                Chưa có tài khoản ?
                <span>
                  <Link to="/register"> Đăng Ký </Link>
                </span>
              </p>
              <p className="text text-normal">
                <span
                  style={{ color: "#1890ff", cursor: "pointer" }}
                  onClick={() => setIsForgotPasswordVisible(true)}
                >
                  Quên mật khẩu
                </span>
              </p>
            </Form>
          </section>
        </div>
      </main>

      {/* Modal quên mật khẩu */}
      <Modal
        title="Quên mật khẩu"
        visible={isForgotPasswordVisible}
        onOk={handleForgotPassword}
        onCancel={() => setIsForgotPasswordVisible(false)}
        okText="Gửi yêu cầu"
        cancelText="Hủy"
      >
        <Form layout="vertical">
          <Form.Item
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input
              placeholder="Nhập email của bạn"
              value={forgotPasswordEmail}
              onChange={(e) => setForgotPasswordEmail(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LoginPage;
