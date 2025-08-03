const Card = ({ image="", title="Title", price=100 }) => {
    return (
        <div className="card">
            <img src={image} alt={title} className="card-image" />
            <div className="card-content">
                <h3 className="card-title">{title}</h3>
                <p className="card-price">₹{price}</p>
            </div>
        </div>
    );
};

export default Card;
