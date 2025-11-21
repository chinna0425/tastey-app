import './index.css'

const SliderItem = props => {
  const {each} = props
  const {imageUrl, id} = each
  return (
    <div className="slider-image">
      <img src={imageUrl} alt={id} className="slider-inner-image-style" />
    </div>
  )
}
export default SliderItem
