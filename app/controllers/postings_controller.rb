class PostingsController < ApplicationController
  # respond_to :json

  def home
    @postings = Posting.order(date_posted: :desc).limit(500)
    # render component: 'SearchPostings', props: { postings: postings }
  end

  def search
    north_lat = params['northLat'].to_f
    south_lat = params['southLat'].to_f
    east_lon = params['eastLon'].to_f
    west_lon = params['westLon'].to_f
    results = Posting.where('latitude < ? AND latitude > ? AND longitude > ? AND longitude < ?', north_lat, south_lat, west_lon, east_lon)
    render json: { status: :success, results: results }
  end

  def new
  end

  def create
    posting_params = JSON.parse(params[:posting])
    posting = Posting.create posting_params
    posting.photo = params[:photo]
    posting.image_src = posting.photo.url

    if posting.save
      render json: { status: :success, posting: posting }
    else
      render json: { status: :unprocessable_entity, errors: posting.errors.full_messages }
    end
  end
end
