import { FrameComponent } from '../blocks/FrameChildComponents'
import { useRef } from 'react'
import SnapInstance from 'snapsvg-cjs-ts'
import { ParentProps } from '../types'

const Snap = (
  props: ParentProps<
    { className?: string; width?: number; height?: number; viewBox?: string },
    SnapInstance.Paper
  >
) => {
  const frame = useRef<SVGSVGElement>(null!)
  return (
    <>
      <div className={props.className}>
        <svg
          preserveAspectRatio='none'
          ref={frame}
          className='h-full w-full'
          width={props.width ?? 1}
          height={props.height ?? 1}
          viewBox={
            props.viewBox ?? `0 0 ${props.width ?? 1} ${props.height ?? 1}`
          }></svg>
      </div>
      <FrameComponent
        options={props}
        getSelf={async options => {
          const { default: SnapInstance } = await import('snapsvg-cjs-ts')
          const s = SnapInstance(frame.current)
          return s
        }}
        cleanupSelf={s => s.clear()}>
        {props.children}
      </FrameComponent>
    </>
  )
}
export default Snap
