import React from 'react';
import axios from 'axios';
import Gallery from '../../../lib/react-photo-gallery';
import SlideShowView from './SlideShowView';
import TopNav from './TopNav';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      siteName: '',
      reviews: [],
      photos: [],
      currentImage: 0,
      lightboxIsOpen: false,
      mainGridImages: [],
    };
    this.galleryImageCountClick = this.galleryImageCountClick.bind(this);
    this.closeLightbox = this.closeLightbox.bind(this);
    this.openLightbox = this.openLightbox.bind(this);
    this.gotoNext = this.gotoNext.bind(this);
    this.gotoPrevious = this.gotoPrevious.bind(this);
  }

  // send GET request to server on page load
  componentDidMount() {
    const context = this;
    // const id = this.state.currentSite;
    const id = window.location.href.split('/')[4];
    axios.get(`/api/restaurants/${id}/gallery`)
    // axios.get(`/restaurants/${id}/gallery`)
      .then((response) => {
        // console.log(response.data)
        context.setState({
          data: response.data[0],
          siteName: response.data[0].place_name,
        });
        console.log('client received data from id: ', id);
      })
      .then(() => {
        this.setReviewsState();
        this.setPhotosState();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  onGridButtonClick() {
    this.closeLightbox();
    // in future this will render Modal Grid View
  }

  setReviewsState() {
    const siteReviews = this.state.data.reviews;
    this.setState({
      reviews: siteReviews,
    });
  }

  setPhotosState() {
    const urls = [];
    const pics = this.state.data.photos;

    for (let i = 0; i < pics.length; i += 1) {
      const url = {
        src: pics[i].url,
        width: pics[i].width,
        height: pics[i].height,
        caption: this.assignRandomCaption(),
      };
      urls.push(url);
    }
    this.setState({
      photos: urls,
    });
    this.populateMainGrid();
  }

  assignRandomCaption() {
    const reviews = this.state.reviews;
    const randomReview = reviews[Math.floor(Math.random() * reviews.length)];
    const name = randomReview.name.toUpperCase();
    const randomCaption =
    (<div className="author-details"><img src={randomReview.avatar} alt="" className="avatar" /><div className="name">{name}</div></div>);
    return randomCaption;
  }

  populateMainGrid() {
    const display = [];
    for (let i = 0; i < 8; i += 1) {
      display.push(this.state.photos[i]);
    }
    this.setState({ mainGridImages: display });
  }

  galleryImageCountClick() {
    this.setState({
      currentImage: 0,
      lightboxIsOpen: true,
    });
  }

  openLightbox(event, obj) {
    this.setState({
      currentImage: obj.index,
      lightboxIsOpen: true,
    });
  }

  closeLightbox() {
    this.setState({
      currentImage: 0,
      lightboxIsOpen: false,
    });
  }
  gotoPrevious() {
    this.setState({
      currentImage: this.state.currentImage - 1,
    });
  }
  gotoNext() {
    this.setState({
      currentImage: this.state.currentImage + 1,
    });
  }

  render() {
    const photoCount = this.state.photos.length;
    return (
      <div id="main-app">
        <div className="gallery" >
          <TopNav />
          <Gallery
            photos={this.state.mainGridImages}
            onClick={this.openLightbox}
            columns={4}
            margin={3}
          />
          <div
            className="photo-counter"
            onClick={this.galleryImageCountClick}
            role="presentation"
          >{photoCount} PHOTOS &#43;
          </div>
        </div>
        <SlideShowView
          photos={this.state.photos}
          closeLightbox={this.closeLightbox}
          clickPrev={this.gotoPrevious}
          clickNext={this.gotoNext}
          current={this.state.currentImage}
          isLightboxOpen={this.state.lightboxIsOpen}
          placeName={this.state.siteName}
          gridButtonClick={this.onGridButtonClick}
          className="slideshow"
        />
      </div>
    );
  }
}

//  window.App = App;
