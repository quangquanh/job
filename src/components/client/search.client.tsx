import { Button, Col, Form, Input, Row, Select } from "antd";
import { EnvironmentOutlined, MonitorOutlined } from "@ant-design/icons";
import { LOCATION_LIST, SKILLS_LIST } from "@/config/utils";
import { ProForm } from "@ant-design/pro-components";

const SearchClient = ({ setKeyword, setSkill, setAddress }: any) => {
  const optionsSkills = SKILLS_LIST;
  const optionsLocations = LOCATION_LIST;
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    console.log(values);
  };

  return (
    <ProForm
      form={form}
      onFinish={onFinish}
      submitter={{
        render: () => <></>,
      }}
    >
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <h2>Tìm kiếm việc làm</h2>
        </Col>
        <Col span={24} md={8}>
          <ProForm.Item name="keyword">
            <Input
              allowClear
              onChange={(e) => {
                setTimeout(() => {
                  setKeyword(e.target.value);
                }, 500);
              }}
              style={{ width: "100%" }}
              placeholder="Tìm theo tên"
            />
          </ProForm.Item>
        </Col>
        <Col span={24} md={8}>
          <ProForm.Item name="skills">
            <Select
              allowClear
              showArrow={false}
              onChange={(e) => {
                setSkill(e);
              }}
              style={{ width: "100%" }}
              placeholder={
                <>
                  <MonitorOutlined /> Tìm theo kỹ năng...
                </>
              }
              optionLabelProp="label"
              options={optionsSkills}
            />
          </ProForm.Item>
        </Col>
        <Col span={12} md={4}>
          <ProForm.Item name="location">
            <Select
              allowClear
              style={{ width: "100%" }}
              onChange={(v) => {
                setAddress(v);
              }}
              placeholder={
                <>
                  <EnvironmentOutlined /> Địa điểm...
                </>
              }
              optionLabelProp="label"
              options={optionsLocations}
            />
          </ProForm.Item>
        </Col>
        <Col span={12} md={4}>
          <Button type="primary" onClick={() => form.submit()}>
            Tìm kiếm
          </Button>
        </Col>
      </Row>
    </ProForm>
  );
};
export default SearchClient;
