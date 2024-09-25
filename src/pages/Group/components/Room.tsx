interface ClassData {
  id: number;
  name: string;
  totalPeople: number;
}
interface props {
  classData: ClassData;
}
const Room = ({ classData }: props) => {
  return (
    <li>
      <a href={`http://localhost:8080/group/progress/${classData.id}`}>
        <div className="data04-name">
          <p>
            {classData.name} {classData.id}반
          </p>
          <span>인원 : {classData.totalPeople}명</span>
          <span>초대 대기 : 1명</span>
        </div>
        <img src="/image/icon_right_arrow2.svg" alt="" />
      </a>
    </li>
  );
};
export default Room;
