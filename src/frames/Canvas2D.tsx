import CanvasComponent, { extractCanvasProps } from '../blocks/CanvasComponent'
import { FrameComponent } from '../blocks/FrameChildComponents'
import { omit } from 'lodash'
import { useRef } from 'react'
import { CanvasComponentProps, ParentProps } from '../types'

const Canvas2D = (
  props: ParentProps<
    React.PropsWithChildren &
      CanvasComponentProps & { options?: CanvasRenderingContext2DSettings },
    CanvasRenderingContext2D
  >
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null!)
  return (
    <>
      <CanvasComponent ref={canvasRef} {...extractCanvasProps(props)} />
      <FrameComponent
        options={omit(props, 'children')}
        getSelf={options => {
          const gl = canvasRef.current.getContext('2d', props.options)!
          return gl
        }}>
        {props.children}
      </FrameComponent>
    </>
  )
}
export default Canvas2D
