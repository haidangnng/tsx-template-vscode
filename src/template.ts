export const renderHooks = (componentName: string) =>
`export type ReceivedProps = Record<string, any>;

const use${componentName} = (props: ReceivedProps) => {
  return {
    ...props,
  };
};

export type Props = ReturnType<typeof use${componentName}>;

export default use${componentName};

`;

export const renderComponents = (componentName: string) =>
`import { FC } from "react";
import useHelloWorld, { Props, ReceivedProps } from "./hook";

const ${componentName}Layout: FC<Props> = (props) => {
  const {} = props;
  return <></>;
};

const ${componentName}: FC<ReceivedProps> = (props) => (
  <${componentName}Layout {...use${componentName}(props)} />
);

export default ${componentName};

`;