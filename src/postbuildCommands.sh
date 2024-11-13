sed -i 'css' 's#/static#/build/static#g' build/static/css/*.css && rm build/static/css/*.csscss
sed -i 'html' 's#="/#="/build/#g' build/index.html && rm build/*.htmlhtml