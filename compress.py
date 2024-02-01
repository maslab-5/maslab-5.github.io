import os
import cv2

def clearDirectory(directory_path):
    '''
    Thank you OpenAI
    '''
    for item in os.listdir(directory_path):
        item_path = os.path.join(directory_path, item)
        if os.path.isfile(item_path):
            os.remove(item_path)
        elif os.path.isdir(item_path):
            clearDirectory(item_path)
            os.rmdir(item_path)

def compressImage(imgPath):
    # Load image and break down path
    img = cv2.imread(imgPath)
    split = imgPath.split("/")

    # Enter Compressed directory
    os.chdir('Compressed/')

    # Create new/Enter pre-existing directory to write compressed image
    if split[-2] not in os.listdir():
        os.mkdir(split[-2])
        os.chdir(split[-2] + '/')
        cv2.imwrite(split[-1], img)
    else:
        os.chdir(split[-2] + '/')
        cv2.imwrite(split[-1], img)

    # Exit all the way back to original directory
    os.chdir('../../')

def compressVideo(vidPath):
    '''
    https://www.opencvhelp.org/tutorials/advanced/video-compression/
    '''
    cap = cv2.VideoCapture(vidPath)
    split = vidPath.split("/")

    if not cap.isOpened():
        print("Error: Could not open the input video file.")
        exit()

    if split[-2] not in os.listdir('Compressed/'):
        os.mkdir('Compressed/' + split[-2])

    output_file = 'Compressed/' + '/'.join(split[-2:])
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')  # Change this to your desired codec
    frame_size = (int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)), int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT)))
    frame_rate = int(cap.get(cv2.CAP_PROP_FPS))

    out = cv2.VideoWriter(output_file, fourcc, frame_rate, frame_size, isColor=True)

    if not out.isOpened():
        print("Error: Could not create the output video file.")
        cap.release()
        exit()

    while cap.isOpened():
        ret, frame = cap.read()

        if not ret:
            break

        out.write(frame)

    cap.release()
    out.release()

clearDirectory('Compressed/')
rootdir = 'ImagesAndVideos/'

for subdir, dirs, files in os.walk(rootdir):
    for file in files:
        if not(".DS_Store" in os.path.join(subdir, file)):
            if os.path.join(subdir, file).endswith(".png"):
                compressImage(os.path.join(subdir, file))
            elif os.path.join(subdir, file).endswith(".mp4"):
                compressVideo(os.path.join(subdir, file))
            else:
                print("What the fuck")

print("Done")
