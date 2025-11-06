import { OpenUrlString } from "@/components/OpenUrlString";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="py-2 space-y-6">
      <div className="space-y-2">
        <h1 className="text-lg font-semibold">致谢</h1>
        <div>
          本项目的数据接口完全依赖于
          <OpenUrlString url="https://github.com/dd-center/vtbs.moe/blob/master/api.md#vtbsmoe-open-api">
            vtbs.moe Open API
          </OpenUrlString>
          提供的接口，在此对他们表示诚挚的感谢。为减轻上游接口的压力，本项目采用了一定的数据缓存机制。
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-lg font-semibold">声明</h1>
        <div>
          非商业性与学习研究用途：本项目是个人开发的学习性质项目，旨在探讨桌面应用开发技术，绝不用于任何商业用途。所有功能均基于公开API实现，仅提供基础的信息展示。
        </div>
        <div>
          数据来源与版权归属：本项目本身不产生、不存储任何实质性的视频、图片或文本内容。所有展示的数据的版权与知识产权均归属于原作者。
        </div>
        <div>
          免责条款：开发者不对通过本项目展示的数据内容的准确性、完整性负责，也不对因使用本项目而可能产生的任何直接或间接损失承担责任。本项目仅为技术演示，与任何内容平台无直接关联。
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-lg font-semibold">说明</h1>
        <div>
          项目定位：本项目是根据公开 API 实现的、仅具备
          <OpenUrlString url="https://vtbs.moe/">vtbs.moe</OpenUrlString>
          站点基础功能的“丐版”桌面客户端，技术架构简单。
        </div>
        <div>
          问题反馈与整改：本项目尊重原作者及平台的权益。如您认为本项目存在任何不当之处，或涉及任何版权、利益冲突问题，请务必通过
          <OpenUrlString url="https://github.com/codenoobforreal/vtbsfun">
            github及其上注明的邮箱
          </OpenUrlString>
          联系开发者，我将第一时间进行核实与处理。
        </div>
      </div>
    </div>
  );
}
