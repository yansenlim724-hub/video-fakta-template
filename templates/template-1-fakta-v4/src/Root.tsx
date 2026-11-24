import { MyComposition } from "./Composition";
import { FaktaBulanV2 } from "./CompositionV2";
import { FaktaBulanV3 } from "./CompositionV3";
import { FaktaBulanV4 } from "./CompositionV4";
import { FaktaBulanV5 } from "./CompositionV5";
import { FaktaLebah } from "./CompositionLebah";
import { FaktaHiu } from "./CompositionHiu";
import { FaktaHiuDirector } from "./CompositionHiuDirector";
import { FaktaHiuV2 } from "./CompositionHiuV2";
import { FaktaHiuV3 } from "./CompositionHiuV3";
import { FaktaHiuV4 } from "./CompositionHiuV4";
import { FaktaGurita } from "./CompositionGurita";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <FaktaBulanV2 />
      <FaktaBulanV3 />
      <FaktaBulanV4 />
      <FaktaBulanV5 />
      <FaktaLebah />
      <FaktaHiu />
      <FaktaHiuDirector />
      <FaktaHiuV2 />
      <FaktaHiuV3 />
      <FaktaHiuV4 />
      <FaktaGurita />
    </>
  );
};
