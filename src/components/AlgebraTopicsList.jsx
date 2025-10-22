import { useNavigate } from "react-router-dom";

import Layout from './Layout'
import FOILMethod from "../a-topics/FOILMethod";

export const ALG_TOPICS = [
  {
    id: "foil",
    title: "FOIL Method",
    path: "/algebra/foil-method",
    component: FOILMethod,
    icon: <VscTriangleRight />,
  },
];

export default function GeometryTopicsList() {
  return (
    <Layout title="Algebra Topics List" topics={ALG_TOPICS} backPath="/dashboard" />
  );
}
