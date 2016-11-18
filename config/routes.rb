Rails.application.routes.draw do
  root to: 'postings#search'
  resources :postings
end
