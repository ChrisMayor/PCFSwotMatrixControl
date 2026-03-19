import { IInputs, IOutputs } from './generated/ManifestTypes';
import { SwotMatrix, ISwotMatrixProps } from './SwotMatrixControl';
import * as React from 'react';

const DEFAULT_DATA = JSON.stringify({
  strengths: [],
  weaknesses: [],
  opportunities: [],
  threats: [],
});

export class SwotMatrixControl implements ComponentFramework.ReactControl<IInputs, IOutputs> {
  private notifyOutputChanged: () => void;
  private currentData: string = DEFAULT_DATA;

  constructor() {
    /* empty */
  }

  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    _state: ComponentFramework.Dictionary,
  ): void {
    this.notifyOutputChanged = notifyOutputChanged;
  }

  public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
    const rawValue = context.parameters.swotData.raw;
    const swotData = rawValue ?? this.currentData;

    const props: ISwotMatrixProps = {
      swotData,
      onDataChanged: (newData: string) => {
        this.currentData = newData;
        this.notifyOutputChanged();
      },
      disabled: context.mode.isControlDisabled,
    };

    return React.createElement(SwotMatrix, props);
  }

  public getOutputs(): IOutputs {
    return { swotData: this.currentData };
  }

  public destroy(): void {
    /* empty */
  }
}
