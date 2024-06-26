import { useRef } from 'react'
import CanvasComponent, { extractCanvasProps } from '../blocks/CanvasComponent'
import { FrameComponent } from '../blocks/FrameChildComponents'
import { omit } from 'lodash'
import { CanvasComponentProps, ParentProps } from '../types'
import type HydraInstance from 'hydra-synth'

const Hydra = (
  props: ParentProps<Omit<CanvasComponentProps, 'type'>, HydraInstance['synth']>
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null!)
  return (
    <>
      <CanvasComponent ref={canvasRef} {...extractCanvasProps(props)} />
      <FrameComponent
        options={omit(props, 'children')}
        getSelf={async options => {
          const { default: HydraInstance } = await import('hydra-synth')
          const hydra = new HydraInstance({
            canvas: canvasRef.current,
            width: options.width,
            height: options.height,
            autoLoop: true,
            makeGlobal: false
          })

          document
            .querySelector(
              'canvas[style="width: 100px; height: 80px; position: absolute; right: 0px; bottom: 0px;"]'
            )
            ?.remove()
          return hydra.synth
        }}>
        {props.children}
      </FrameComponent>
    </>
  )
}

export default Hydra
