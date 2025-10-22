// TopicsList.jsx
import { Link } from 'react-router-dom';

import { GiPencilRuler } from "react-icons/gi";
import { VscTriangleRight } from "react-icons/vsc";
import { PiArrowsClockwise } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

import Layout from './Layout'
import ParallelLines from "../g-topics/ParallelLines";
import SohCahToa from "../g-topics/SohCahToa";
import GeometricTransformations from "../g-topics/GeometricTransformations";

export const GEOM_TOPICS = [
  {
    id: "parallel-lines",
    title: "Parallel Lines & Transversals",
    path: "/geometry/transversals",
    component: ParallelLines,
    icon: <VscTriangleRight />,
  },
  {
    id: "soh-cah-toa",
    title: "Right Triangles (SOH CAH TOA)",
    path: "/geometry/soh-cah-toa",
    component: SohCahToa,
    icon: <GiPencilRuler />,
  },
  {
    id: "geometric-transformations",
    title: "Geometric Transformations",
    path: "/geometry/transformations",
    component: GeometricTransformations,
    icon: <PiArrowsClockwise />,
  },
];

export default function GeometryTopicsList() {
  const navigate = useNavigate();

  return (
    <Layout title="Geometry Topics List" topics={GEOM_TOPICS} backPath="/dashboard" />
  );
}
