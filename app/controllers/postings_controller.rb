class PostingsController < ApplicationController
  # respond_to :json

  def home
    postings = Posting.all
    render component: 'SearchPostings', props: { postings: postings }
  end

  def search
    search_params = JSON.parse params[:search]
    north_lat = search_params['northLat']
    south_lat = search_params['southLat']
    east_lon = search_params['eastLon']
    west_lon = search_params['westLon']
  end

  def new
    render component: 'AddPosting'
  end

  def create
    posting_params = JSON.parse(params[:posting])
    posting = Posting.create posting_params
    posting.photo = params[:photo]

    if posting.save
      render json: { status: :success, posting: posting }
    else
      render json: { status: :unprocessable_entity, errors: posting.errors.full_messages }
    end
  end
end
