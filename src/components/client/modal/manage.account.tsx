import {
  Button,
  Col,
  Descriptions,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Spin,
  Table,
  Tabs,
  message,
  notification,
} from "antd";
import { isMobile } from "react-device-detect";
import type { TabsProps } from "antd";
import { IResume } from "@/types/backend";
import { useState, useEffect } from "react";
import {
  callFetchResumeByUser,
  callGetSubscriberSkills,
  callUpdateSubscriber,
} from "@/config/api";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { MonitorOutlined } from "@ant-design/icons";
import { SKILLS_LIST } from "@/config/utils";
import { useAppSelector } from "@/redux/hooks";
import instance from "@/config/axios-customize";

interface IProps {
  open: boolean;
  onClose: (v: boolean) => void;
}

const UserResume = (props: any) => {
  const [listCV, setListCV] = useState<IResume[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  useEffect(() => {
    const init = async () => {
      setIsFetching(true);
      const res = await callFetchResumeByUser();
      if (res && res.data) {
        setListCV(res.data as IResume[]);
      }
      setIsFetching(false);
    };
    init();
  }, []);

  const columns: ColumnsType<IResume> = [
    {
      title: "STT",
      key: "index",
      width: 50,
      align: "center",
      render: (text, record, index) => {
        return <>{index + 1}</>;
      },
    },
    {
      title: "Công Ty",
      dataIndex: ["companyId", "name"],
    },
    {
      title: "Vị trí",
      dataIndex: ["jobId", "name"],
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
    },
    {
      title: "Ngày rải CV",
      dataIndex: "createdAt",
      render(value, record, index) {
        return <>{dayjs(record.createdAt).format("DD-MM-YYYY HH:mm:ss")}</>;
      },
    },
    {
      title: "",
      dataIndex: "",
      render(value, record, index) {
        return (
          <a
            href={`${import.meta.env.VITE_BACKEND_URL}/images/resume/${
              record?.url
            }`}
            target="_blank"
          >
            Chi tiết
          </a>
        );
      },
    },
  ];

  return (
    <div>
      <Table<IResume>
        columns={columns}
        dataSource={listCV}
        loading={isFetching}
        pagination={false}
      />
    </div>
  );
};

const { Option } = Select;

const UserUpdateInfo = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false); // Trạng thái hiển thị hoặc chỉnh sửa

  // Fetch thông tin chi tiết user
  const fetchUserInfo = async () => {
    setLoading(true);
    try {
      const response = await instance.get("api/v1/auth/user-info");
      console.log(response);
      if (response.data && response.data) {
        setUserInfo(response.data);
        form.setFieldsValue(response.data); // Set giá trị form khi ở chế độ chỉnh sửa
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      message.error("Không thể tải thông tin người dùng.");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý cập nhật thông tin user
  const handleUpdateUser = async (values: any) => {
    try {
      const response = await instance.patch("api/v1/users", {
        _id: userInfo._id,
        ...values,
      });
      console.log(response);
      if (response.statusCode === 200) {
        message.success("Cập nhật thông tin thành công!");
        fetchUserInfo(); // Refresh thông tin người dùng sau khi cập nhật
        setIsEditMode(false); // Quay lại chế độ xem
      }
    } catch (error) {
      console.error("Error updating user info:", error);
      message.error("Không thể cập nhật thông tin người dùng.");
    }
  };

  useEffect(() => {
    fetchUserInfo(); // Fetch thông tin người dùng khi component được mount
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>
        {isEditMode ? "Chỉnh sửa thông tin" : "Thông tin người dùng"}
      </h2>
      {!isEditMode ? (
        // View hiển thị thông tin người dùng
        <div>
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Tên">{userInfo?.name}</Descriptions.Item>
            <Descriptions.Item label="Email">
              {userInfo?.email}
            </Descriptions.Item>
            <Descriptions.Item label="Tuổi">{userInfo?.age}</Descriptions.Item>
            <Descriptions.Item label="Giới tính">
              {userInfo?.gender === "male" ? "Nam" : "Nữ"}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">
              {userInfo?.address}
            </Descriptions.Item>
            <Descriptions.Item label="Vai trò">
              {userInfo?.role?.name}
            </Descriptions.Item>
          </Descriptions>
          <div style={{ marginTop: 20, textAlign: "center" }}>
            <Button type="primary" onClick={() => setIsEditMode(true)}>
              Chỉnh sửa thông tin
            </Button>
          </div>
        </div>
      ) : (
        // View chỉnh sửa thông tin người dùng
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateUser}
          autoComplete="off"
        >
          {/* Tên */}
          <Form.Item
            label="Tên"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
          >
            <Input placeholder="Nhập tên" />
          </Form.Item>

          {/* Email */}
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>

          {/* Tuổi */}
          <Form.Item
            label="Tuổi"
            name="age"
            rules={[
              { required: true, message: "Vui lòng nhập tuổi!" },
              { pattern: /^\d+$/, message: "Tuổi phải là số!" },
            ]}
          >
            <Input placeholder="Nhập tuổi" />
          </Form.Item>

          {/* Giới tính */}
          <Form.Item
            label="Giới tính"
            name="gender"
            rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
          >
            <Select placeholder="Chọn giới tính">
              <Option value="male">Nam</Option>
              <Option value="female">Nữ</Option>
            </Select>
          </Form.Item>

          {/* Địa chỉ */}
          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
          >
            <Input placeholder="Nhập địa chỉ" />
          </Form.Item>

          {/* Nút cập nhật và hủy */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginRight: 10 }}
            >
              Cập nhật
            </Button>
            <Button onClick={() => setIsEditMode(false)}>Hủy</Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

const UserUpdatePassword = (props: any) => {
  const [form] = Form.useForm();

  // Xử lý gửi yêu cầu thay đổi mật khẩu
  const handleChangePassword = async (values: any) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error("Mật khẩu mới và nhập lại mật khẩu không khớp!");
      return;
    }

    try {
      const response = await instance.patch("api/v1/users/change-password", {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      if (response.statusCode === 200) {
        message.success("Đổi mật khẩu thành công!");
        form.resetFields();
      } else {
        message.error(response?.message || "Đã xảy ra lỗi, vui lòng thử lại.");
      }
    } catch (error: any) {
      console.error("Error changing password:", error);
      message.error(
        error.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại."
      );
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>Thay đổi mật khẩu</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleChangePassword}
        autoComplete="off"
      >
        {/* Mật khẩu cũ */}
        <Form.Item
          label="Mật khẩu cũ"
          name="oldPassword"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu cũ!" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
          ]}
        >
          <Input.Password placeholder="Nhập mật khẩu cũ" />
        </Form.Item>

        {/* Mật khẩu mới */}
        <Form.Item
          label="Mật khẩu mới"
          name="newPassword"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu mới!" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
          ]}
        >
          <Input.Password placeholder="Nhập mật khẩu mới" />
        </Form.Item>

        {/* Nhập lại mật khẩu mới */}
        <Form.Item
          label="Nhập lại mật khẩu mới"
          name="confirmPassword"
          rules={[
            { required: true, message: "Vui lòng nhập lại mật khẩu mới!" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
          ]}
        >
          <Input.Password placeholder="Nhập lại mật khẩu mới" />
        </Form.Item>

        {/* Nút đổi mật khẩu */}
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Đổi mật khẩu
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

const JobByEmail = (props: any) => {
  const [form] = Form.useForm();
  const user = useAppSelector((state) => state.account.user);

  useEffect(() => {
    const init = async () => {
      const res = await callGetSubscriberSkills();
      if (res && res.data) {
        form.setFieldValue("skills", res.data.skills);
      }
    };
    init();
  }, []);

  const onFinish = async (values: any) => {
    const { skills } = values;
    const res = await callUpdateSubscriber({
      email: user.email,
      name: user.name,
      skills: skills ? skills : [],
    });
    if (res.data) {
      message.success("Cập nhật thông tin thành công");
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
      });
    }
  };

  return (
    <>
      <Form onFinish={onFinish} form={form}>
        <Row gutter={[20, 20]}>
          <Col span={24}>
            <Form.Item
              label={"Kỹ năng"}
              name={"skills"}
              rules={[
                { required: true, message: "Vui lòng chọn ít nhất 1 skill!" },
              ]}
            >
              <Select
                mode="multiple"
                allowClear
                showArrow={false}
                style={{ width: "100%" }}
                placeholder={
                  <>
                    <MonitorOutlined /> Tìm theo kỹ năng...
                  </>
                }
                optionLabelProp="label"
                options={SKILLS_LIST}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Button onClick={() => form.submit()}>Cập nhật</Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};

const ManageAccount = (props: IProps) => {
  const { open, onClose } = props;

  const onChange = (key: string) => {
    // console.log(key);
  };

  const items: TabsProps["items"] = [
    {
      key: "user-resume",
      label: `Rải CV`,
      children: <UserResume />,
    },
    {
      key: "email-by-skills",
      label: `Nhận Jobs qua Email`,
      children: <JobByEmail />,
    },
    {
      key: "user-update-info",
      label: `Cập nhật thông tin`,
      children: <UserUpdateInfo />,
    },
    {
      key: "user-password",
      label: `Thay đổi mật khẩu`,
      children: <UserUpdatePassword />,
    },
  ];

  return (
    <>
      <Modal
        title="Quản lý tài khoản"
        open={open}
        onCancel={() => onClose(false)}
        maskClosable={false}
        footer={null}
        destroyOnClose={true}
        width={isMobile ? "100%" : "1000px"}
      >
        <div style={{ minHeight: 400 }}>
          <Tabs
            defaultActiveKey="user-resume"
            items={items}
            onChange={onChange}
          />
        </div>
      </Modal>
    </>
  );
};

export default ManageAccount;
