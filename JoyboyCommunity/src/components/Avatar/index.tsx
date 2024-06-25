import {useId} from 'react';
import {ImageSourcePropType} from 'react-native';
import {Defs, Image, ImageProps, Path, Pattern, Svg} from 'react-native-svg';

export type AvatarProps = ImageProps & {
  size?: number;
  source?: ImageSourcePropType;
};

export const Avatar: React.FC<AvatarProps> = ({size, source}) => {
  const id = useId();

  return (
    <Svg width={size} height={size} viewBox="0 0 96 96" fill="none">
      <Path
        d="M40.75 4.91784C45.2363 2.32766 50.7637 2.32766 55.25 4.91784L81.6852 20.1802C86.1716 22.7704 88.9352 27.5573 88.9352 32.7376V63.2624C88.9352 68.4427 86.1716 73.2296 81.6852 75.8198L55.25 91.0822C50.7637 93.6723 45.2363 93.6723 40.75 91.0822L14.3148 75.8198C9.82844 73.2296 7.06475 68.4427 7.06475 63.2624V32.7376C7.06475 27.5573 9.82844 22.7704 14.3148 20.1802L40.75 4.91784Z"
        fill={`url(#pattern_${id})`}
        stroke="#F4F9FF"
        strokeWidth="3"
      />

      <Defs>
        <Pattern id={`pattern_${id}`} patternUnits="userSpaceOnUse" width="96" height="96">
          <Image
            id={`image_${id}`}
            width="96"
            height="96"
            preserveAspectRatio="xMinYMin slice"
            href={source}
          />
        </Pattern>
      </Defs>
    </Svg>
  );
};
